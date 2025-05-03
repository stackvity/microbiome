// File: frontend/hooks/queries/useProducts.ts
// --- START OF FILE ---
// Rationale: Encapsulates logic for fetching product lists via React Query. (Task ID: FE-032)
// Revision: Export ProductFilters interface.

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { ProductSummary } from "@/types"; // Path verified

interface ProductListResponse {
  products: ProductSummary[];
  limit: number;
  offset: number;
  count: number;
}

// FIX: Export the interface
export interface ProductFilters {
  limit?: number;
  offset?: number;
  category_handle?: string[];
  collection_handle?: string[];
  tags?: string[];
  q?: string;
  // Add other potential filter keys based on API capabilities
}

/**
 * Fetches a list of products from the backend API based on applied filters.
 * Corresponds to `GET /store/products`.
 */
const fetchProducts = async (
  filters?: ProductFilters
): Promise<ProductListResponse> => {
  const params = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          // Handle array parameters like category_handle[]
          value.forEach((item) => params.append(`${key}[]`, item));
        } else {
          params.append(key, String(value));
        }
      }
    });
  }

  const response = await api.get<ProductListResponse>("/store/products", {
    params: params,
  });
  return response.data;
};

/**
 * React Query hook for fetching a list of products.
 * Manages caching, background updates, and state for the product list.
 * Rationale (Task ID FE-032)
 */
export const useProducts = (
  filters?: ProductFilters,
  options?: object
): UseQueryResult<ProductListResponse, Error> => {
  return useQuery<ProductListResponse, Error>({
    // Query key includes filters to ensure cache distinguishes different filtered lists
    queryKey: ["products", filters],
    queryFn: () => fetchProducts(filters),
    ...options,
  });
};

// --- END OF FILE ---
