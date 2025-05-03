// File: frontend/hooks/mutations/useUpdateCartItem.ts
// --- START OF FILE ---
// Rationale: Encapsulates logic for updating cart item via React Query Mutation. (Task ID: FE-037)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { Cart } from "@/types"; // Path verified
// FIX: Comment out missing import as '@/lib/cart-utils' was not found in the provided fullstack-code.
// import { ensureCartId } from "@/lib/cart-utils"; // Path confirmed
// FIX: Comment out missing import as '@/components/ui/use-toast' was not found in the provided fullstack-code.
// Assuming toast implementation exists per Rec. A.4
// import { useToast } from "@/components/ui/use-toast"; // Example path

interface CartResponse {
  cart: Cart;
}

interface UpdateCartItemPayload {
  lineId: string;
  quantity: number; // Quantity must be >= 1 for update endpoint
}

interface UpdateCartItemVariables extends UpdateCartItemPayload {
  cartId: string;
}

/**
 * Updates the quantity of a line item in the specified cart.
 * Corresponds to `POST /store/carts/{cartId}/line-items/{lineId}`.
 */
const updateCartItem = async ({
  cartId,
  lineId,
  quantity,
}: UpdateCartItemVariables): Promise<CartResponse> => {
  // Removed client-side quantity check per Rec. A.3; rely on backend validation.
  const response = await api.post<CartResponse>(
    `/store/carts/${cartId}/line-items/${lineId}`,
    { quantity }
  );
  return response.data;
};

/**
 * React Query mutation hook for updating an item's quantity in the cart.
 */
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  // FIX: Comment out usage of useToast as the module is missing.
  // const { toast } = useToast(); // Integrated per Rec. A.4

  return useMutation<CartResponse, Error, UpdateCartItemPayload>({
    mutationFn: async (payload) => {
      // Ensure quantity > 0 before calling mutation from UI component
      // This hook assumes quantity is valid for an update operation (>= 1)
      if (payload.quantity <= 0) {
        // Recommend triggering remove mutation from UI instead
        console.warn(
          "Update attempted with quantity <= 0. Use remove instead."
        );
        throw new Error("Quantity must be positive for update.");
      }
      // FIX: Comment out usage of ensureCartId as the module is missing.
      // const cartId = await ensureCartId();
      // --- START OF REQUIRED IMPLEMENTATION DETAIL (Placeholder for cartId) ---
      // TODO: Implement logic to retrieve or generate the cartId, similar to useCart.ts.
      // This placeholder uses localStorage, replace with actual logic from cart-utils later.
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        console.error(
          "Cart ID is missing. UpdateCartItem logic needs implementation based on cart-utils."
        );
        // Consider if cart creation is appropriate here, likely not for an update.
        throw new Error(
          "Cart ID is missing. Cannot update item without cart-utils logic."
        );
      }
      // --- END OF REQUIRED IMPLEMENTATION DETAIL ---
      return updateCartItem({ ...payload, cartId });
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["cart"], data); // Optimistic update
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // FIX: Comment out usage of toast as the hook is missing.
      // toast({ title: "Cart Updated", description: "Item quantity changed." });
      console.log("Cart item updated:", data.cart); // Keep console log for dev debugging
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
    },
    onError: (error) => {
      console.error("Error updating cart item:", error.message);
      // FIX: Comment out usage of toast as the hook is missing.
      // toast({
      //   title: "Error Updating Item",
      //   description: `Could not update item quantity: ${error.message}`,
      //   variant: "destructive",
      // });
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
    },
  });
};

// --- END OF FILE ---
