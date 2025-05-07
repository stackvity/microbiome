/* START OF FILE frontend/hooks/mutations/useAddToCart.ts */
// FILE: frontend/hooks/mutations/useAddToCart.ts
// Task ID: FE-036
// Description: React Query mutation hook for adding an item to the cart.
// Status: Revised - Assumes API/Type verification (A.2) passed. Added note re: B.1.

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { AddToCartInput, Cart } from "@/types/cart";

// Define the expected API response structure based on CRT-API-008
interface AddToCartResponse {
  cart: Cart;
}

// Define the variables needed for the mutation function
interface AddToCartVariables {
  cartId: string;
  item: AddToCartInput; // Contains variant_id and quantity
}

// Asynchronous function to add an item to the cart via API
const addToCart = async ({
  cartId,
  item,
}: AddToCartVariables): Promise<AddToCartResponse> => {
  // Endpoint verified against CRT-API-008
  const { data } = await api.post<AddToCartResponse>(
    `/store/carts/${cartId}/line-items`,
    item
  );
  return data;
};

/**
 * Custom React Query mutation hook to add an item to the shopping cart.
 * Handles the API call and invalidates the cart query cache on success.
 * @returns {UseMutationResult<AddToCartResponse, Error, AddToCartVariables>} React Query mutation result object.
 */
export const useAddToCart = (): UseMutationResult<
  AddToCartResponse,
  Error,
  AddToCartVariables
> => {
  const queryClient = useQueryClient();

  return useMutation<AddToCartResponse, Error, AddToCartVariables>({
    mutationFn: addToCart,
    onSuccess: (data) => {
      const cartId = data?.cart?.id;
      if (cartId) {
        // Invalidate the specific cart query to trigger a refetch
        queryClient.invalidateQueries({ queryKey: ["cart", cartId] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      // Note (Rec B.1): User feedback (toast notification) should ideally be triggered
      // in the component calling `mutate`, using the `onSuccess` callback provided there.
      // This allows for more context-specific messaging.
    },
    onError: (error) => {
      // Note (Rec B.1): User feedback for errors should ideally be handled
      // in the component calling `mutate`, using the `onError` callback provided there.
      // Generic errors are caught by the axios interceptor.
      console.error("Add to cart mutation failed:", error);
    },
  });
};
/* END OF FILE frontend/hooks/mutations/useAddToCart.ts */
