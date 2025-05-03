// File: frontend/components/features/product/ProductListContainer.tsx
// --- START OF FILE ---
// Rationale: Orchestrates data fetching and presentation for the product list view. (Task ID: FE-039)
// Revision incorporates recommendations from analysis and fixes imports/missing Alert.

"use client"; // Required for hooks

import React from "react";
import { useProducts, type ProductFilters } from "@/hooks/queries/useProducts"; // Path verified (FE-032) - ProductFilters is now exported
// Import Presentational Components (Assuming they exist/will be created)
// import ProductList from '@/components/product/ProductList'; // Example path (FE-BL-009)
import { Skeleton } from "@/components/ui/skeleton"; // Path verified (FE-031)
// FIX: Removed import for non-existent Alert component
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Path verified
import { Terminal } from "lucide-react"; // Path verified

// Define props if the container needs to receive configuration, e.g., filters
interface ProductListContainerProps {
  filters?: ProductFilters; // Accept filters as props
  // Add pagination props if implementing client-side pagination or passing params to hook
}

/**
 * Container component responsible for fetching product list data
 * and handling loading/error states before passing data to the
 * presentational ProductList component.
 */
const ProductListContainer: React.FC<ProductListContainerProps> = ({
  filters,
}) => {
  const { data, error, isLoading, isError } = useProducts(
    filters
    // { staleTime: 1000 * 60 * 1 } // Optional B.3: Example: Cache data for 1 minute
  );

  // Loading State
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Render multiple skeleton loaders */}
        {Array.from({ length: 8 }).map((_, index) => (
          // Assuming a standard product card skeleton structure
          <div key={index} className="space-y-2">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  // Error State
  if (isError) {
    // FIX: Replace missing Alert component with styled div
    return (
      <div
        role="alert"
        className="relative w-full rounded-lg border border-destructive bg-background p-4 text-destructive [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-destructive"
      >
        <Terminal className="h-4 w-4" />
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          Error Loading Products
        </h5>
        <div className="text-sm [&_p]:leading-relaxed">
          {error?.message ||
            "Could not fetch products at this time. Please try again later."}
        </div>
      </div>
    );
  }

  // Empty State (No products match filters or none exist)
  if (!data || data.products.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        No products found matching your criteria.
      </div>
    );
  }

  // Success State - Render the presentational component
  return (
    <div>
      {/* Recommendation A.2: Placeholder for the actual ProductList presentational component. */}
      {/* The ProductList component will receive 'data.products' as props */}
      {/* Example: <ProductList products={data.products} /> */}

      {/* Development/Placeholder: Displaying raw data until ProductList component is implemented */}
      <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
      {/* TODO: Implement Pagination controls using data.count, data.limit, data.offset */}
    </div>
  );
};

export default ProductListContainer;
// --- END OF FILE ---
