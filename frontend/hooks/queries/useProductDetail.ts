/* START OF FILE frontend/hooks/queries/useProductDetail.ts */
// FILE: frontend/hooks/queries/useProductDetail.ts
// Task ID: FE-033
// Description: React Query hook for fetching details of a single product.
// Status: Revised - Assumes API/Type verification (A.2) passed.

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { Product } from "@/types/product";

// Define the expected API response structure based on PRD-API-006
interface ProductDetailResponse {
  product: Product;
}

// Asynchronous function to fetch product details
const fetchProductDetail = async (
  handleOrId: string
): Promise<ProductDetailResponse> => {
  // Endpoint verified against PRD-API-006
  const { data } = await api.get<ProductDetailResponse>(
    `/store/products/${handleOrId}`
  );
  return data;
};

/**
 * Custom React Query hook to fetch details for a single product by its handle or ID.
 * Manages fetching state, caching, and conditional fetching based on identifier presence.
 * @param {string | null | undefined} handleOrId - The product handle or ID. Query is disabled if falsy.
 * @returns {UseQueryResult<ProductDetailResponse, Error>} The state of the query execution.
 */
export const useProductDetail = (
  handleOrId: string | null | undefined
): UseQueryResult<ProductDetailResponse, Error> => {
  const queryKey = ["product", handleOrId];

  return useQuery<ProductDetailResponse, Error>({
    queryKey: queryKey,
    queryFn: () => {
      if (!handleOrId) {
        return Promise.reject(new Error("Product handle or ID is required"));
      }
      return fetchProductDetail(handleOrId);
    },
    enabled: !!handleOrId,
  });
};
/* END OF FILE frontend/hooks/queries/useProductDetail.ts */
