/* START OF FILE frontend/components/product/ProductListContainer.tsx */
// FILE: frontend/components/product/ProductListContainer.tsx
// Task ID: FE-039
// Description: Container component using useProducts hook to fetch and display products.
// Status: Revised - Applied skeleton sizing recommendation A.3 and error message recommendation A.2. Corrected data access from 'products' to 'items'.

import React from "react";
import { useProducts } from "@/hooks/queries/useProducts";
import ProductList from "@/components/product/ProductList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import type { AxiosError } from "axios"; // Import AxiosError type

// Define query parameters interface matching potential API options
// Duplicating interface temporarily until centralized type management if needed
interface ProductListParams {
  limit?: number;
  offset?: number;
  order?: string;
  category_handle?: string[];
  collection_handle?: string[];
  status?: string[];
  q?: string;
}

interface ProductListContainerProps {
  filters?: ProductListParams;
}

/**
 * Container component responsible for fetching product list data
 * using the useProducts hook and handling loading/error states.
 * Renders the ProductList component with the fetched data.
 */
const ProductListContainer: React.FC<ProductListContainerProps> = ({
  filters = { limit: 12 }, // Default filters including limit
}) => {
  const { data, isLoading, isError, error } = useProducts(filters);

  const displayLimit = filters.limit ?? 12; // Use the actual limit for skeleton count

  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        data-testid="product-list-loading"
      >
        {/* Generate skeletons based on the limit used in the query (Rec A.3) */}
        {Array.from({ length: displayLimit }).map((_, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    // Use structured error message from interceptor if available (Rec A.2)
    const axiosError = error as AxiosError<{
      structuredError?: { message: string };
    }>;
    const message =
      axiosError.response?.data?.structuredError?.message ||
      error?.message ||
      "Could not fetch products at this time. Please try again later.";
    return (
      <Alert variant="destructive" data-testid="product-list-error">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Products</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  // Corrected: Access 'items' property from 'data' object
  return <ProductList products={data?.items ?? []} />;
};

export default ProductListContainer;
/* END OF FILE frontend/components/product/ProductListContainer.tsx */
