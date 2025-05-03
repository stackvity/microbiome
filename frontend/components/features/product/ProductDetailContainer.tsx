// File: frontend/components/features/product/ProductDetailContainer.tsx
// --- START OF FILE ---
// Rationale: Orchestrates data fetching and presentation for the product detail view. (Task ID: FE-040)
// Revision incorporates recommendations from analysis and fixes missing import.

"use client"; // Required for hooks

import React from "react";
import { useProductDetail } from "@/hooks/queries/useProductDetail"; // Path verified (FE-033)
// Import Presentational Components (Assuming they exist/will be created)
// import ProductDetailView from '@/components/product/ProductDetailView'; // Example path (FE-BL-009)
import { Skeleton } from "@/components/ui/skeleton"; // Path verified (FE-031)
// FIX: Removed import for non-existent Alert component
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Path verified
import { Terminal } from "lucide-react"; // Path verified

// Define props for the container, requiring a product identifier (ID or handle)
interface ProductDetailContainerProps {
  /** Product identifier (ID or handle) passed usually via URL params */
  identifier: string | undefined | null;
}

/**
 * Container component responsible for fetching detailed product data
 * based on an identifier, handling loading/error states, and passing
 * data to the presentational ProductDetailView component.
 */
const ProductDetailContainer: React.FC<ProductDetailContainerProps> = ({
  identifier,
}) => {
  // Fetch product details using the hook
  const { data, error, isLoading, isError, isFetching } = useProductDetail(
    identifier,
    {
      // Optional B.3: Example: Keep data fresh but avoid excessive background refetches
      // staleTime: 1000 * 60 * 5, // 5 minutes
      // refetchOnWindowFocus: false,
    }
  );

  // Loading State (Initial load or background fetching)
  // Show skeleton during initial load or when fetching in background after invalidation
  if (isLoading || (isFetching && !data)) {
    // Matches skeleton structure assumed in previous version.
    return (
      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-96 w-full" />
          <div className="grid grid-cols-4 gap-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
        {/* Details Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-10 w-1/2 mt-4" />{" "}
          {/* Option/Add Button Placeholder */}
        </div>
      </div>
    );
  }

  // Error State
  if (isError || !data) {
    // Recommendation A.1: Check for specific error types (e.g., 404) if possible,
    // but acknowledge potential variance in error structure from React Query/Axios.
    // This basic check attempts to detect 404 based on common Axios error structure.
    let errorMessage =
      error?.message ||
      "Could not load product details. Please try again later.";
    // Assumption: The Axios interceptor might throw custom errors or AxiosError might be wrapped by React Query.
    // Checking response status might require casting or checking nested properties.
    if ((error as any)?.response?.status === 404) {
      errorMessage = "Product not found.";
    }

    // FIX: Replace missing Alert component with styled div
    return (
      <div
        role="alert"
        className="relative w-full rounded-lg border border-destructive bg-background p-4 text-destructive [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-destructive"
      >
        <Terminal className="h-4 w-4" />
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          Error Loading Product
        </h5>
        <div className="text-sm [&_p]:leading-relaxed">{errorMessage}</div>
      </div>
    );
  }

  // Success State - Render the presentational component
  // The hook ensures 'data' is available here if !isLoading and !isError
  return (
    <div>
      {/* Recommendation A.2: Placeholder for the actual ProductDetailView presentational component. */}
      {/* The ProductDetailView component will receive 'data.product' as props */}
      {/* Example: <ProductDetailView product={data.product} /> */}

      {/* Development/Placeholder: Displaying raw data until ProductDetailView component is implemented */}
      <pre className="mt-4 p-4 bg-muted rounded-md overflow-x-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default ProductDetailContainer;
// --- END OF FILE ---
