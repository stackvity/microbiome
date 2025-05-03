// File: frontend/hooks/queries/useCart.ts
// --- START OF FILE ---
// Rationale: Encapsulates logic for fetching cart data via React Query. (Task ID: FE-035)

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { Cart } from "@/types"; // Path verified
// FIX: Comment out missing import as '@/lib/cart-utils' was not found in the provided fullstack-code.
// import { ensureCartId } from "@/lib/cart-utils"; // Path confirmed

interface CartResponse {
  cart: Cart;
}

/**
 * Fetches the current cart details after ensuring a cart ID exists.
 * Corresponds to `GET /store/carts/{cartId}`.
 */
const fetchCart = async (): Promise<CartResponse> => {
  // FIX: Comment out usage of ensureCartId as the module is missing.
  // const cartId = await ensureCartId(); // Centralized logic for getting/creating ID

  // --- START OF REQUIRED IMPLEMENTATION DETAIL ---
  // TODO: Implement logic to retrieve or generate the cartId.
  // This will likely involve checking local storage, session storage,
  // or making an initial API call to create/retrieve a cart if none exists.
  // The actual implementation depends on the strategy defined in the project's
  // cart management logic (which should reside in the missing '@/lib/cart-utils').
  // For now, throwing an error as cartId is essential.
  const cartId = localStorage.getItem("cart_id"); // Example placeholder - Replace with actual logic
  if (!cartId) {
    // Handle cart creation or throw error if cart must exist
    // Example: Call api.post('/store/carts')?
    // Or throw, requiring ensureCartId logic elsewhere.
    console.error(
      "Cart ID is missing. Cart fetching logic needs implementation based on cart-utils."
    );
    throw new Error("Cart ID is missing. Cannot fetch cart.");
  }
  // --- END OF REQUIRED IMPLEMENTATION DETAIL ---

  try {
    // Fetch the cart using the guaranteed ID
    const response = await api.get<CartResponse>(`/store/carts/${cartId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    // Re-throw error for React Query to handle
    throw error;
  }
};

/**
 * React Query hook for fetching the user's current shopping cart.
 */
// Add explicit return type annotation to the hook function signature.
export const useCart = (
  options?: object // Accepts standard react-query options
): UseQueryResult<CartResponse, Error> => {
  // Stable query key for the 'current' cart concept
  // FIX: Use 'as const' to ensure the type is inferred as `readonly ["cart"]`
  const queryKey = ["cart"] as const;

  // Pass the correctly typed queryKey to useQuery
  // FIX: Removed onError callback as it's not a valid option in TanStack Query v5 useQuery.
  // Error handling should be done via the returned query result state (isError, error)
  // or globally via QueryClient configuration.
  const result = useQuery<CartResponse, Error, CartResponse, typeof queryKey>({
    // Pass the variable with the correct type
    queryKey: queryKey,
    queryFn: fetchCart,
    // Global defaults for staleTime, cacheTime etc. are assumed to be set
    // in the QueryClientProvider (Rec. B.2)
    // Adding specific error handling as per Rec. B.3 - Now handled by checking hook result
    // onError: (error) => { // <-- Removed this block
    //   console.error("Failed to fetch cart state:", error.message);
    //   // Potentially trigger global error state or notification here
    // },
    ...options, // Spread any additional options passed in
  });

  // Keep type assertion as it might still be needed depending on exact RQ version/inference nuances
  return result as UseQueryResult<CartResponse, Error>;
};

// --- END OF FILE ---
