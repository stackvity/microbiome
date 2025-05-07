// FILE: frontend/components/cart/CartDisplay.tsx
// Rationale: Displays cart contents (items, quantities, totals) on the cart page. Task ID: Implied by FE-041
// Status: Revised - Applied Recommendation A.2. Added Separator import. Assumes Cart type includes region object.
import * as React from "react";
import Link from "next/link";
import { Cart, LineItem } from "@/types/cart"; // Assumes Cart type will have optional region object
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button"; // Corrected case based on provided file
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CartLineItem from "./CartLineItem";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Separator } from "@/components/ui/separator"; // IMPORTED Separator

interface CartDisplayProps {
  cart: Cart | null | undefined;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemoveItem: (lineItemId: string) => void;
  isUpdating: boolean;
}

/**
 * Displays the main shopping cart contents and summary.
 */
const CartDisplay: React.FC<CartDisplayProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  isUpdating,
}) => {
  // Enhanced loading state (matches US-FE-019 pattern)
  if (cart === undefined) {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="md:col-span-1 space-y-4">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  // Error state
  if (cart === null) {
    // TODO: Use a dedicated error component (Optional Improvement B.1)
    return (
      <p className="text-destructive">Error loading cart. Please try again.</p>
    );
  }

  // Empty cart state (enhanced per Optional Improvement B.1)
  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-16" data-testid="cart-empty">
        {/* TODO: Replace with appropriate empty cart icon */}
        <div className="text-4xl mb-4">🛒</div>
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">
          Looks like you haven't added any items yet.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  // Recommendation A.2: Safer access to totals and currency
  // Assumes cart.region.currency_code will be available if cart.region exists.
  const currencyCode = cart.region?.currency_code ?? "usd";
  const subtotal = cart.subtotal ?? 0;
  const shippingTotal = cart.shipping_total; // Can be null/undefined if not set
  const taxTotal = cart.tax_total; // Can be null/undefined if not set
  const total = cart.total ?? 0;

  return (
    <div
      className="grid md:grid-cols-3 gap-8 lg:gap-12"
      data-testid="cart-page"
    >
      {/* Cart Items Table */}
      <div className="md:col-span-2">
        <h2 className="text-2xl font-semibold mb-6">
          Shopping Cart ({cart.items.length} items)
        </h2>
        <Table data-testid="cart-items-container">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] sm:w-[100px] pr-0"></TableHead>{" "}
              {/* Image col */}
              <TableHead>Product Details</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-right hidden md:table-cell">
                Unit Price
              </TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="w-[50px] pl-0"></TableHead>{" "}
              {/* Remove col */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {cart.items.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                onUpdateQuantity={onUpdateQuantity}
                onRemoveItem={onRemoveItem}
                isUpdating={isUpdating}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Cart Summary */}
      <div className="md:col-span-1 space-y-6">
        <h2 className="text-2xl font-semibold">Order Summary</h2>
        <div className="p-6 border rounded-lg bg-card space-y-3">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span
              data-testid="cart-subtotal"
              className="font-medium text-foreground"
            >
              {formatCurrency(subtotal, currencyCode)}
            </span>
          </div>
          {shippingTotal !== undefined && shippingTotal !== null && (
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span>
              <span>
                {shippingTotal === 0
                  ? "Free"
                  : formatCurrency(shippingTotal, currencyCode)}
              </span>
            </div>
          )}
          {taxTotal !== undefined && taxTotal !== null && (
            <div className="flex justify-between text-muted-foreground">
              <span>Tax</span>
              <span>{formatCurrency(taxTotal, currencyCode)}</span>
            </div>
          )}
          <Separator className="my-2" />{" "}
          {/* Component Separator is now imported */}
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span data-testid="cart-total">
              {formatCurrency(total, currencyCode)}
            </span>
          </div>
        </div>
        <Button
          size="lg"
          className="w-full"
          asChild
          data-testid="checkout-button"
        >
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
};

export default CartDisplay;
