/* START OF FILE frontend/hooks/mutations/useUpdateCartItem.ts */
// FILE: frontend/hooks/mutations/useUpdateCartItem.ts
// Task ID: FE-037
// Description: React Query mutation hook for updating the quantity of an item in the cart.
// Status: Revised - Applied error handling recommendation A.2. Replaced useToast with sonner.

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
  QueryKey,
} from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { Cart, UpdateCartItemInput } from "@/types/cart";
import { toast } from "sonner"; // IMPORTED Sonner toast function
import type { AxiosError } from "axios"; // Import AxiosError type

// Define the expected API response structure based on CRT-API-008
interface UpdateCartItemResponse {
  cart: Cart;
}

// Define the variables needed for the mutation function
interface UpdateCartItemVariables {
  cartId: string;
  lineItemId: string;
  item: UpdateCartItemInput; // Contains quantity
}

// Asynchronous function to update an item's quantity in the cart via API
const updateCartItem = async ({
  cartId,
  lineItemId,
  item,
}: UpdateCartItemVariables): Promise<UpdateCartItemResponse> => {
  const { data } = await api.post<UpdateCartItemResponse>(
    `/store/carts/${cartId}/line-items/${lineItemId}`,
    item
  );
  return data;
};

/**
 * Custom React Query mutation hook to update the quantity of an item in the shopping cart.
 * Handles the API call and invalidates the cart query cache on success.
 * @returns {UseMutationResult<UpdateCartItemResponse, Error | AxiosError, UpdateCartItemVariables>} React Query mutation result object.
 */
export const useUpdateCartItem = (): UseMutationResult<
  UpdateCartItemResponse,
  Error | AxiosError, // Include AxiosError for better typing
  UpdateCartItemVariables
> => {
  const queryClient = useQueryClient();
  // const { toast } = useToast(); // REMOVED old useToast

  return useMutation<
    UpdateCartItemResponse,
    Error | AxiosError,
    UpdateCartItemVariables
  >({
    mutationFn: updateCartItem,
    onSuccess: (data) => {
      const cartId = data?.cart?.id;
      const queryKey: QueryKey = ["cart", cartId];
      if (cartId) {
        queryClient.invalidateQueries({ queryKey });
        // Optional: Optimistic update
        // queryClient.setQueryData(queryKey, data);
      } else {
        queryClient.invalidateQueries({ queryKey: ["cart"] });
      }
      toast.success("Cart Updated", {
        // Using Sonner toast
        description: "Item quantity successfully updated.",
      });
    },
    onError: (error) => {
      console.error("Update cart item mutation failed:", error);
      // Use structured error message from interceptor if available (Rec A.2)
      const axiosError = error as AxiosError<{
        structuredError?: { message: string };
        error?: { message?: string }; // For Medusa specific error structure
      }>;
      const message =
        axiosError.response?.data?.structuredError?.message ||
        axiosError.response?.data?.error?.message || // Check Medusa specific error
        error.message ||
        "Could not update item quantity. Please try again.";
      toast.error("Update Failed", {
        // Using Sonner toast
        description: message,
      });
    },
  });
};
/* END OF FILE frontend/hooks/mutations/useUpdateCartItem.ts */
