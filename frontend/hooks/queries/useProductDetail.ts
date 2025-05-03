// File: frontend/hooks/queries/useProductDetail.ts
// --- START OF FILE ---

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { ProductDetail } from "@/types"; // Path verified

interface ProductDetailResponse {
  product: ProductDetail;
}

/**
 * Fetches detailed information for a single product using its identifier (ID or handle).
 * Corresponds to `GET /store/products/{identifier}`.
 * **Note:** The specific identifier used (Medusa `id` vs. `handle`) needs verification against the API contract (PRD-API-006) and backend implementation.
 */
const fetchProductDetail = async (
  identifier: string
): Promise<ProductDetailResponse> => {
  if (!identifier) {
    // Prevent API call if identifier is missing (should be caught by 'enabled' flag)
    throw new Error("Product identifier is required to fetch product details.");
  }
  // Use the identifier directly in the URL path.
  const response = await api.get<ProductDetailResponse>(
    `/store/products/${identifier}`
  );
  return response.data;
};

/**
 * React Query hook for fetching detailed information for a single product.
 * Manages caching, background updates, and state for product details.
 * Rationale (Task ID FE-033)
 */
export const useProductDetail = (
  identifier: string | undefined | null, // Accept product ID or handle, or null/undefined
  options?: object
): UseQueryResult<ProductDetailResponse, Error> => {
  return useQuery<ProductDetailResponse, Error>({
    // Query key includes identifier to ensure cache distinguishes different products
    queryKey: ["product", identifier],
    // Query function requires a valid identifier
    queryFn: () => {
      if (!identifier) {
        // Provides safety, although 'enabled' should prevent this call
        return Promise.reject(new Error("Product identifier is missing"));
      }
      return fetchProductDetail(identifier);
    },
    // Disable the query if identifier is not provided
    enabled: !!identifier,
    ...options,
  });
};

// --- END OF FILE ---
