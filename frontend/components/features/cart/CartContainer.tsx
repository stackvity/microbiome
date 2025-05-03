// File: frontend/components/features/cart/CartContainer.tsx
// --- START OF FILE ---
// Rationale: Orchestrates data fetching and mutations for the cart view. (Task ID: FE-041)
// Revision incorporates recommendations from analysis and fixes missing import.

"use client"; // Required for hooks

import React from "react";
import { useCart } from "@/hooks/queries/useCart"; // Path verified (FE-035)
import { useUpdateCartItem } from "@/hooks/mutations/useUpdateCartItem"; // Path verified (FE-037)
import { useRemoveCartItem } from "@/hooks/mutations/useRemoveCartItem"; // Path verified (FE-038)
// Import Presentational Components (Assuming they exist/will be created)
// import CartDisplay from '@/components/cart/CartDisplay'; // Example path (FE-BL-009)
// import CartEmpty from '@/components/cart/CartEmpty'; // Example path (FE-BL-009)
import { Skeleton } from "@/components/ui/skeleton"; // Path verified (FE-031)
import { Spinner } from "@/components/ui/spinner"; // Path verified (FE-031)
// FIX: Removed import for non-existent Alert component
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Path verified
import { Terminal } from "lucide-react"; // Path verified

// Define props if the container needs configuration (less common for cart)
interface CartContainerProps {}

/**
 * Container component responsible for fetching the current cart state,
 * providing mutation functions for cart updates (quantity change, removal),
 * handling loading/error/empty states, and passing data/handlers down
 * to the presentational CartDisplay component.
 */
const CartContainer: React.FC<CartContainerProps> = () => {
  // Fetch cart data
  const {
    data: cartData,
    error: cartError,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useCart();
  // { staleTime: 0, gcTime: 0 } // Optional B.3: Example: Always fetch fresh cart data

  // Get mutation hooks
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();

  // Handler functions to pass down to the presentational component
  const handleQuantityChange = (lineId: string, quantity: number) => {
    // Basic client-side validation or rely on hook/API validation
    if (quantity > 0) {
      updateItem({ lineId, quantity });
    } else {
      // Trigger remove if quantity is zero or less
      // Medusa's update endpoint handles quantity > 0, so remove must be called explicitly.
      handleRemoveItem(lineId);
    }
  };

  const handleRemoveItem = (lineId: string) => {
    removeItem({ lineId });
  };

  // Loading State
  if (isCartLoading) {
    // Matches skeleton structure assumed in previous version.
    return (
      <div className="space-y-4">
        {/* Cart Items Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        {/* Summary Skeleton */}
        <div className="space-y-2 pt-4 border-t">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </div>
    );
  }

  // Error State
  if (isCartError) {
    // FIX: Replace missing Alert component with styled div
    return (
      <div
        role="alert"
        className="relative w-full rounded-lg border border-destructive bg-background p-4 text-destructive [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-destructive"
      >
        <Terminal className="h-4 w-4" />
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          Error Loading Cart
        </h5>
        <div className="text-sm [&_p]:leading-relaxed">
          {cartError?.message ||
            "Could not load your shopping cart. Please try again later."}
        </div>
      </div>
    );
  }

  // Empty State (Cart exists but has no items)
  if (!cartData || cartData.cart.items.length === 0) {
    // return <CartEmpty />; // Render dedicated empty cart component
    return (
      <div className="text-center text-muted-foreground py-10">
        Your shopping cart is empty.
        {/* Optionally add a "Continue Shopping" button/link */}
      </div>
    );
  }

  // Success State - Render the presentational component
  return (
    <div>
      {/* Recommendation A.2: Placeholder for the actual CartDisplay presentational component. */}
      {/* The CartDisplay component will receive cartData.cart, handlers, and loading states as props */}
      {/* Example:
            <CartDisplay
                cart={cartData.cart}
                onQuantityChange={handleQuantityChange}
                onRemoveItem={handleRemoveItem}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
            />
            */}

      {/* Development/Placeholder: Displaying raw data until CartDisplay component is implemented */}
      <div className="relative">
        {/* Recommendation B.1: Basic overlay spinner shows general mutation activity.
            Consider enhancing CartDisplay to disable specific item controls during updates for better UX. */}
        {(isUpdating || isRemoving) && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10 opacity-75">
            <Spinner className="h-8 w-8" />
          </div>
        )}
        <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
          {JSON.stringify(cartData, null, 2)}
        </pre>
        {/* Example buttons to simulate interaction triggering the handlers */}
        <p className="mt-4 font-semibold">Simulated Update/Remove Handlers:</p>
        <div className="flex space-x-2 mt-2">
          {cartData.cart.items.length > 0 && cartData.cart.items[0] && (
            <>
              <button
                onClick={() =>
                  handleQuantityChange(
                    cartData.cart.items[0].id,
                    cartData.cart.items[0].quantity + 1
                  )
                }
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isUpdating || isRemoving}
              >
                Incr Qty Item 1
              </button>
              <button
                onClick={() =>
                  handleQuantityChange(
                    cartData.cart.items[0].id,
                    cartData.cart.items[0].quantity - 1
                  )
                }
                className="p-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                disabled={
                  isUpdating ||
                  isRemoving ||
                  cartData.cart.items[0].quantity <= 0
                }
              >
                Decr Qty Item 1
              </button>
              <button
                onClick={() => handleRemoveItem(cartData.cart.items[0].id)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={isUpdating || isRemoving}
              >
                Remove Item 1
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartContainer;
// --- END OF FILE ---
