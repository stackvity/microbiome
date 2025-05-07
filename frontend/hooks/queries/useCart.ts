/* START OF FILE frontend/hooks/queries/useCart.ts */
// FILE: frontend/hooks/queries/useCart.ts
// Task ID: FE-035
// Description: React Query hook for fetching the current user's cart data.
// Status: Revised - Implemented Recommendation A.1: Accepts cartId as parameter. Assumes API/Type verification (A.2) passed. Considering B.3.

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { Cart } from "@/types/cart";

// Define the expected API response structure based on CRT-API-008
interface CartResponse {
  cart: Cart;
}

// Asynchronous function to fetch cart details
const fetchCart = async (cartId: string): Promise<CartResponse> => {
  // Endpoint verified against CRT-API-008
  const { data } = await api.get<CartResponse>(`/store/carts/${cartId}`);
  return data;
};

/**
 * Custom React Query hook to fetch the current user's shopping cart using its ID.
 * Manages fetching state, caching, and background updates.
 * Query is disabled if cartId is null or undefined.
 * @param {string | null | undefined} cartId - The ID of the cart to fetch.
 * @returns {UseQueryResult<CartResponse, Error>} The state of the query execution.
 */
export const useCart = (
  cartId: string | null | undefined
): UseQueryResult<CartResponse, Error> => {
  const queryKey = ["cart", cartId];

  return useQuery<CartResponse, Error>({
    queryKey: queryKey,
    queryFn: () => {
      if (!cartId) {
        // This rejection primarily satisfies TypeScript, as 'enabled' prevents execution.
        return Promise.reject(new Error("Cart ID is required to fetch cart."));
      }
      return fetchCart(cartId);
    },
    // Only run the query if a cartId is provided.
    enabled: !!cartId,
    // Consider adjusting staleTime/gcTime based on how frequently cart updates are expected
    // staleTime: 1000 * 30, // e.g., 30 seconds
  });
};
/* END OF FILE frontend/hooks/queries/useCart.ts */
