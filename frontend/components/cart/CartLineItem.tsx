// FILE: frontend/components/cart/CartLineItem.tsx
// Rationale: Displays a single item row within the cart display. Task ID: Implied by FE-041
// Status: Revised - Corrected Input import casing.
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { LineItem } from "@/types/cart";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"; // CORRECTED CASING
import { TableCell, TableRow } from "@/components/ui/table";
import { X } from "lucide-react";

interface CartLineItemProps {
  item: LineItem;
  onUpdateQuantity: (lineItemId: string, quantity: number) => void;
  onRemoveItem: (lineItemId: string) => void;
  isUpdating: boolean; // Use this to disable input during updates
}

/**
 * Renders a single row in the cart table for a line item.
 * Uses controlled input for quantity updates.
 */
const CartLineItem: React.FC<CartLineItemProps> = ({
  item,
  onUpdateQuantity,
  onRemoveItem,
  isUpdating,
}) => {
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value, 10);

    if (!isNaN(numValue) && numValue >= 1) {
      onUpdateQuantity(item.id, numValue);
    } else if (value === "0") {
      onRemoveItem(item.id);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const numValue = parseInt(value, 10);
    if (value === "" || numValue === 0) {
      onRemoveItem(item.id);
    } else if (isNaN(numValue) || numValue < 1) {
      // Optionally reset input visually to current valid quantity if needed
    }
  };

  const lineItemTotal = item.unit_price * item.quantity;
  const productHandle = item.variant?.product?.handle;
  const currencyCode = item.variant?.prices?.[0]?.currency_code ?? "usd";

  return (
    <TableRow data-testid={`cart-item-${item.id}`}>
      <TableCell className="w-[80px] h-[80px] p-1 pr-3 sm:pr-1">
        <Link
          href={productHandle ? `/products/${productHandle}` : "#"}
          legacyBehavior
        >
          <a className="block w-full h-full relative group overflow-hidden rounded">
            <Image
              src={item.thumbnail || "/images/placeholder.png"}
              alt={item.title}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-200"
            />
          </a>
        </Link>
      </TableCell>
      <TableCell className="align-top py-4">
        <Link
          href={productHandle ? `/products/${productHandle}` : "#"}
          legacyBehavior
        >
          <a className="font-semibold hover:text-primary line-clamp-2">
            {item.title}
          </a>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {item.description}
        </p>
        <p className="text-sm mt-1">
          {formatCurrency(item.unit_price, currencyCode)} each
        </p>
      </TableCell>
      <TableCell className="text-center align-top py-4">
        <Input
          type="number"
          min="1"
          value={item.quantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          disabled={isUpdating}
          className="w-16 text-center h-9 mx-auto"
          aria-label={`Quantity for ${item.title}`}
          data-testid={`quantity-input-${item.id}`}
        />
      </TableCell>
      <TableCell className="text-right hidden md:table-cell align-top py-4">
        {formatCurrency(item.unit_price, currencyCode)}
      </TableCell>
      <TableCell className="text-right font-medium align-top py-4">
        {formatCurrency(lineItemTotal, currencyCode)}
      </TableCell>
      <TableCell className="text-center align-top py-4 pl-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemoveItem(item.id)}
          disabled={isUpdating}
          aria-label={`Remove ${item.title}`}
          data-testid={`remove-item-${item.id}`}
          className="hover:text-destructive"
        >
          <X className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default CartLineItem;
