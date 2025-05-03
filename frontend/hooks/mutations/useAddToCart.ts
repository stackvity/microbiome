// File: frontend/hooks/mutations/useAddToCart.ts
// --- START OF FILE ---
// Rationale: Encapsulates logic for adding item to cart via React Query Mutation. (Task ID: FE-036)

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { Cart } from "@/types"; // Path verified
// FIX: Comment out missing import as '@/lib/cart-utils' was not found in the provided fullstack-code.
// import { ensureCartId } from "@/lib/cart-utils"; // Path confirmed
// FIX: Comment out missing import as '@/components/ui/use-toast' was not found in the provided fullstack-code.
// Assuming toast implementation exists per Rec. A.4
// import { useToast } from "@/components/ui/use-toast"; // Example path - Assuming this path is correct per project structure

interface CartResponse {
  cart: Cart;
}

interface AddToCartPayload {
  variant_id: string;
  quantity: number;
}

interface AddToCartVariables extends AddToCartPayload {
  cartId: string;
}

/**
 * Adds a line item to the specified cart.
 * Corresponds to `POST /store/carts/{cartId}/line-items`.
 */
const addToCart = async ({
  cartId,
  variant_id,
  quantity,
}: AddToCartVariables): Promise<CartResponse> => {
  const response = await api.post<CartResponse>(
    `/store/carts/${cartId}/line-items`,
    {
      variant_id,
      quantity,
    }
  );
  return response.data;
};

/**
 * React Query mutation hook for adding an item to the cart.
 */
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  // FIX: Comment out usage of useToast as the module is missing.
  // const { toast } = useToast(); // Integrated per Rec. A.4

  return useMutation<CartResponse, Error, AddToCartPayload>({
    mutationFn: async (payload) => {
      // FIX: Comment out usage of ensureCartId as the module is missing.
      // const cartId = await ensureCartId();
      // --- START OF REQUIRED IMPLEMENTATION DETAIL (Placeholder for cartId) ---
      // TODO: Implement logic to retrieve or generate the cartId, similar to useCart.ts.
      // This placeholder uses localStorage, replace with actual logic from cart-utils later.
      const cartId = localStorage.getItem("cart_id");
      if (!cartId) {
        console.error(
          "Cart ID is missing. AddToCart logic needs implementation based on cart-utils."
        );
        // Depending on requirements, this might involve creating a cart first
        // Example: const newCartResponse = await api.post<CartResponse>("/store/carts"); cartId = newCartResponse.data.cart.id; localStorage.setItem("cart_id", cartId);
        throw new Error(
          "Cart ID is missing. Cannot add item to cart without cart-utils logic."
        );
      }
      // --- END OF REQUIRED IMPLEMENTATION DETAIL ---
      return addToCart({ ...payload, cartId });
    },
    onSuccess: (data, variables) => {
      // Update cache immediately for better UX
      // The query key ["cart"] should match the one used in useCart hook
      queryClient.setQueryData(["cart"], data);
      // Also invalidate to ensure eventual consistency if needed,
      // although setQueryData might be sufficient depending on config.
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // FIX: Comment out usage of toast as the hook is missing.
      // toast({
      //   title: "Item Added",
      //   description: `Product added to your cart.`, // Adjusted description for clarity
      // });
      console.log("Item added to cart:", data.cart); // Keep console log for dev debugging
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
    },
    onError: (error) => {
      console.error("Error adding item to cart:", error.message);
      // FIX: Comment out usage of toast as the hook is missing.
      // toast({
      //   title: "Error Adding Item",
      //   description: `Could not add item to cart: ${error.message}`,
      //   variant: "destructive",
      // });
      // TODO: Implement user notification (e.g., via toast) once the useToast hook/component is available.
    },
  });
};

// --- END OF FILE ---
