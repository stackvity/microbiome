// File: frontend/hooks/mutations/useRemoveCartItem.ts
// --- START OF FILE ---
// Rationale: Encapsulates logic for removing cart item via React Query Mutation. (Task ID: FE-038)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { Cart, LineItem } from "@/types"; // Path verified
// FIX: Comment out missing import as '@/lib/cart-utils' was not found in the provided fullstack-code.
// import { ensureCartId } from "@/lib/cart-utils"; // Path confirmed
// FIX: Comment out missing import as '@/components/ui/use-toast' was not found in the provided fullstack-code.
// Assuming toast implementation exists per Rec. A.4
// import { useToast } from "@/components/ui/use-toast"; // Example path

interface CartResponse {
  cart: Cart;
}

interface RemoveCartItemPayload {
  lineId: string;
}

interface RemoveCartItemVariables extends RemoveCartItemPayload {
  cartId: string;
}

/**
 * Removes a line item from the specified cart.
 * Corresponds to `DELETE /store/carts/{cartId}/line-items/{lineId}`.
 */
const removeCartItem = async ({
  cartId,
  lineId,
}: RemoveCartItemVariables): Promise<CartResponse> => {
  const response = await api.delete<CartResponse>(
    `/store/carts/${cartId}/line-items/${lineId}`
  );
  return response.data;
};

/**
 * Calculates the new totals for a cart based on its items.
 * Helper function for optimistic updates.
 */
const calculateCartTotals = (items: LineItem[]): Partial<Cart> => {
  let subtotal = 0;
  items.forEach((item) => {
    // Ensure item price and quantity are valid numbers before calculation
    const price = Number(item.unit_price) || 0;
    const quantity = Number(item.quantity) || 0;
    subtotal += price * quantity;
  });
  // Note: Shipping and tax totals cannot be accurately recalculated client-side
  // without potentially complex logic or assumptions. Invalidation handles this.
  // Here, we only recalculate subtotal and approximate total based on that.
  // A more robust optimistic update might reset shipping/tax or use previous values cautiously.
  const total = subtotal; // Simplified approximation for optimistic update
  return { subtotal, total };
};

/**
 * React Query mutation hook for removing an item from the cart.
 */
export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();
  // FIX: Comment out usage of useToast as the module is missing.
  // const { toast } = useToast(); // Integrated per Rec. A.4

  return useMutation<CartResponse, Error, RemoveCartItemPayload>({
    mutationFn: async (payload) => {
      // FIX: Comment out usage of ensureCartId as the module is missing.
      // const cartId = await ensureCartId();
      // --- START OF REQUIRED IMPLEMENTATION DETAIL (Placeholder for cartId) ---
      // TODO: Implement logic to retrieve or generate the cartId, similar to useCart.ts.
      // This placeholder uses localStorage, replace with actual logic from cart-utils later.
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        console.error(
          "Cart ID is missing. RemoveCartItem logic needs implementation based on cart-utils."
        );
        // Consider if cart creation is appropriate here, likely not for a remove action.
        throw new Error(
          "Cart ID is missing. Cannot remove item without cart-utils logic."
        );
      }
      // --- END OF REQUIRED IMPLEMENTATION DETAIL ---
      return removeCartItem({ ...payload, cartId });
    },
    // Incorporating Rec. B.1: Enhance optimistic update
    onSuccess: (data, variables) => {
      // Optimistic Update: Remove item and recalculate totals client-side
      queryClient.setQueryData(
        ["cart"],
        (oldData: CartResponse | undefined): CartResponse | undefined => {
          if (!oldData) return undefined;

          const updatedItems = oldData.cart.items.filter(
            (item) => item.id !== variables.lineId
          );
          const newTotals = calculateCartTotals(updatedItems);

          return {
            ...oldData,
            cart: {
              ...oldData.cart,
              items: updatedItems,
              subtotal: newTotals.subtotal ?? oldData.cart.subtotal, // Use calculated or fallback
              total: newTotals.total ?? oldData.cart.total, // Use calculated or fallback
              // Resetting shipping/tax optimistically might be safer if complex
              // shipping_total: 0,
              // tax_total: 0,
            },
          };
        }
      );

      // Invalidate after optimistic update to ensure eventual consistency
      queryClient.invalidateQueries({ queryKey: ["cart"] });

      // FIX: Comment out usage of toast as the hook is missing.
      // toast({ title: "Item Removed", description: "Item removed from cart." });
      console.log("Cart item removed, optimistic update applied."); // Keep console log
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
      // Server data returned for logging if needed: console.log("Server cart state after removal:", data.cart);
    },
    onError: (error) => {
      console.error("Error removing cart item:", error.message);
      // FIX: Comment out usage of toast as the hook is missing.
      // toast({
      //   title: "Error Removing Item",
      //   description: `Could not remove item: ${error.message}`,
      //   variant: "destructive",
      // });
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
      // Invalidate cart on error to revert optimistic update if it occurred
      // (though RQ typically handles rollback on mutation error)
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// --- END OF FILE ---
