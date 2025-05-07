/* START OF FILE frontend/components/cart/CartContainer.tsx */
// FILE: frontend/components/cart/CartContainer.tsx
// Task ID: FE-041
// Description: Container component using useCart and mutation hooks to display and manage the cart.
// Status: Revised - Applied cartId retrieval (A.1) and error handling (A.2) recommendations. Replaced useToast with sonner.

import React, { useState, useEffect } from "react"; // Added useState, useEffect for cartId management example
import { useCart } from "@/hooks/queries/useCart";
import { useUpdateCartItem } from "@/hooks/mutations/useUpdateCartItem";
import { useRemoveCartItem } from "@/hooks/mutations/useRemoveCartItem";
import CartDisplay from "@/components/cart/CartDisplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner"; // IMPORTED Sonner toast function
import { useCartStore } from "@/store/useCartStore"; // Example: Assumes cartId is in Zustand store (FE-BL-003)
import type { AxiosError } from "axios"; // Import AxiosError type

/**
 * Container component responsible for fetching cart data using the useCart hook,
 * managing cart item updates/removals via mutations, and handling loading/error/empty states.
 * Renders the CartDisplay component.
 */
const CartContainer: React.FC = () => {
  // const { toast } = useToast(); // REMOVED old useToast
  // Retrieve cartId from global state (Rec A.1)
  // **VERIFY:** This implementation assumes cartId is stored in Zustand. Adapt as necessary.
  // Consider local state or context if Zustand isn't the final choice for cartId management.
  // Example using Zustand:
  const zustandCartId = useCartStore((state) => state.cartId);

  // Example using local state with effect (another possible pattern if cartId isn't global)
  // const [localCartId, setLocalCartId] = useState<string | null>(null);
  // useEffect(() => {
  //   // Replace with actual logic to get cart ID from local storage, context etc.
  //   const storedCartId = localStorage.getItem('cart_id');
  //   setLocalCartId(storedCartId);
  // }, []);
  // const cartId = localCartId; // Use the state variable

  // Using Zustand version for this example:
  const cartId = zustandCartId;

  const {
    data: cartResponse,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useCart(cartId); // Pass the retrieved cart ID to the hook

  const { mutate: updateItemMutate, isPending: isUpdatingItem } =
    useUpdateCartItem();
  const { mutate: removeItemMutate, isPending: isRemovingItem } =
    useRemoveCartItem();

  const handleUpdateQuantity = (lineItemId: string, quantity: number) => {
    if (!cartId) {
      toast.error("Error", {
        // Using Sonner toast
        description: "Cart not found.",
      });
      return;
    }
    updateItemMutate(
      {
        cartId: cartId,
        lineItemId: lineItemId,
        item: { quantity: quantity },
      },
      {
        // Added onSuccess and onError for specific feedback related to cart operations
        onSuccess: () => {
          toast.success("Cart Updated", {
            description: "Item quantity successfully updated.",
          });
        },
        onError: (err: any) => {
          const axiosError = err as AxiosError<{
            structuredError?: { message: string };
            error?: { message?: string };
          }>;
          const message =
            axiosError.response?.data?.structuredError?.message ||
            axiosError.response?.data?.error?.message ||
            err.message ||
            "Could not update item quantity. Please try again.";
          toast.error("Update Failed", {
            description: message,
          });
        },
      }
    );
  };

  const handleRemoveItem = (lineItemId: string) => {
    if (!cartId) {
      toast.error("Error", {
        // Using Sonner toast
        description: "Cart not found.",
      });
      return;
    }
    removeItemMutate(
      {
        cartId: cartId,
        lineItemId: lineItemId,
      },
      {
        // Added onSuccess and onError for specific feedback related to cart operations
        onSuccess: () => {
          toast.success("Item Removed", {
            description: "Item successfully removed from your cart.",
          });
        },
        onError: (err: any) => {
          const axiosError = err as AxiosError<{
            structuredError?: { message: string };
            error?: { message?: string };
          }>;
          const message =
            axiosError.response?.data?.structuredError?.message ||
            axiosError.response?.data?.error?.message ||
            err.message ||
            "Could not remove item. Please try again.";
          toast.error("Removal Failed", {
            description: message,
          });
        },
      }
    );
  };

  const isUpdating = isUpdatingItem || isRemovingItem;

  // Handle loading state before cartId is potentially available
  // This prevents running useCart with null/undefined if cartId source is async
  if (
    cartId === undefined ||
    (cartId === null && !isCartLoading && !isCartError)
  ) {
    // If cartId is explicitly null (and we aren't loading/erroring), it likely means no cart exists.
    // Render the CartDisplay which handles the empty state.
    // Or display a specific "No cart found" message if preferred.
    return (
      <CartDisplay
        cart={null}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        isUpdating={isUpdating}
      />
    );
  }

  if (isCartLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-8" data-testid="cart-loading">
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

  if (isCartError) {
    // Use structured error message from interceptor if available (Rec A.2)
    const axiosError = cartError as AxiosError<{
      structuredError?: { message: string };
      error?: { message?: string }; // Added to check for Medusa specific error structure
    }>;
    const message =
      axiosError.response?.data?.structuredError?.message ||
      axiosError.response?.data?.error?.message || // Check Medusa specific error
      cartError?.message ||
      "Could not load your shopping cart at this time. Please try again later.";
    return (
      <Alert variant="destructive" data-testid="cart-error">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Cart</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  // Pass null if cartResponse or cartResponse.cart is undefined/null
  // CartDisplay component handles the empty cart state internally
  return (
    <CartDisplay
      cart={cartResponse?.cart ?? null}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      isUpdating={isUpdating}
    />
  );
};

export default CartContainer;
/* END OF FILE frontend/components/cart/CartContainer.tsx */
