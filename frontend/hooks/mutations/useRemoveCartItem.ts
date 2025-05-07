/* START OF FILE frontend/hooks/mutations/useRemoveCartItem.ts */
// FILE: frontend/hooks/mutations/useRemoveCartItem.ts
// Task ID: FE-038
// Description: React Query mutation hook for removing an item from the cart.
// Status: Revised - Applied error handling recommendation A.2. Replaced useToast with sonner.

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { Cart } from "@/types/cart";
import { toast } from "sonner"; // IMPORTED Sonner toast function
import type { AxiosError } from "axios"; // Import AxiosError type

// Define the expected API response structure based on CRT-API-008
interface RemoveCartItemResponse {
  cart: Cart;
}

// Define the variables needed for the mutation function
interface RemoveCartItemVariables {
  cartId: string;
  lineItemId: string;
}

// Asynchronous function to remove an item from the cart via API
const removeCartItem = async ({
  cartId,
  lineItemId,
}: RemoveCartItemVariables): Promise<RemoveCartItemResponse> => {
  const { data } = await api.delete<RemoveCartItemResponse>(
    `/store/carts/${cartId}/line-items/${lineItemId}`
  );
  return data;
};

/**
 * Custom React Query mutation hook to remove an item from the shopping cart.
 * Handles the API call and invalidates the cart query cache on success.
 * @returns {UseMutationResult<RemoveCartItemResponse, Error | AxiosError, RemoveCartItemVariables>} React Query mutation result object.
 */
export const useRemoveCartItem = (): UseMutationResult<
  RemoveCartItemResponse,
  Error | AxiosError, // Include AxiosError for better typing
  RemoveCartItemVariables
> => {
  const queryClient = useQueryClient();
  // const { toast } = useToast(); // REMOVED old useToast

  return useMutation<
    RemoveCartItemResponse,
    Error | AxiosError,
    RemoveCartItemVariables
  >({
    mutationFn: removeCartItem,
    onSuccess: (data) => {
      const cartId = data?.cart?.id;
      const queryKey: QueryKey = ["cart", cartId];
      if (cartId) {
        queryClient.invalidateQueries({ queryKey });
        // Optional: Optimistic update
        // queryClient.setQueryData(queryKey, data);
      } else {
        // Fallback if cartId is not present in response, invalidate all carts.
        // This might be too broad but ensures some level of update.
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      toast.success("Item Removed", {
        // Using Sonner toast
        description: "Item successfully removed from your cart.",
      });
    },
    onError: (error) => {
      console.error("Remove cart item mutation failed:", error);
      // Use structured error message from interceptor if available (Rec A.2)
      const axiosError = error as AxiosError<{
        structuredError?: { message: string };
        error?: { message?: string }; // For Medusa specific error structure
      }>;
      const message =
        axiosError.response?.data?.structuredError?.message ||
        axiosError.response?.data?.error?.message || // Check Medusa specific error
        error.message ||
        "Could not remove item. Please try again.";
      toast.error("Removal Failed", {
        // Using Sonner toast
        description: message,
      });
    },
  });
};
/* END OF FILE frontend/hooks/mutations/useRemoveCartItem.ts */
