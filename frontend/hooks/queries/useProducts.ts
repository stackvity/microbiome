/* START OF FILE frontend/hooks/queries/useProducts.ts */
// FILE: frontend/hooks/queries/useProducts.ts
// Task ID: FE-032
// Description: React Query hook for fetching product lists.
// Status: Revised - Updated params based on Recommendation A.3. Assumes API/Type verification (A.2) passed.

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { ProductSummary } from "@/types/product";
import type { PaginatedResponse } from "@/types/api";

// Define query parameters interface matching potential API options
// Note: Based on PRD-API-006 examples. Verify against final API implementation.
interface ProductListParams {
  limit?: number;
  offset?: number;
  order?: string; // e.g., '-created_at', 'title'
  category_handle?: string[];
  collection_handle?: string[];
  status?: string[]; // e.g., 'published' (Storefront typically only fetches published)
  q?: string; // General search query
  // Add other relevant filter parameters as defined in PRD-API-006
}

// Define the expected API response structure
type ProductListResponse = PaginatedResponse<ProductSummary>;

// Asynchronous function to fetch products from the API
const fetchProducts = async (
  params: ProductListParams
): Promise<ProductListResponse> => {
  // Endpoint verified against PRD-API-006
  const { data } = await api.get<ProductListResponse>("/store/products", {
    params,
  });
  return data;
};

/**
 * Custom React Query hook to fetch a list of products.
 * Manages fetching state, caching, and background updates.
 * @param {ProductListParams} params - Query parameters for filtering/pagination. Defaults to limit 20, offset 0.
 * @returns {UseQueryResult<ProductListResponse, Error>} The state of the query execution.
 */
export const useProducts = (
  params: ProductListParams = { limit: 20, offset: 0 }
): UseQueryResult<ProductListResponse, Error> => {
  const queryKey = ["products", params];

  return useQuery<ProductListResponse, Error>({
    queryKey: queryKey,
    queryFn: () => fetchProducts(params),
  });
};
/* END OF FILE frontend/hooks/queries/useProducts.ts */
