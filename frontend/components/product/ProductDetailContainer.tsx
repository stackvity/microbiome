/* START OF FILE frontend/components/product/ProductDetailContainer.tsx */
// FILE: frontend/components/product/ProductDetailContainer.tsx
// Task ID: FE-040
// Description: Container component using useProductDetail hook to fetch and display product details.
// Status: Revised - Applied cartId retrieval (A.1) and error handling (A.2) recommendations. Kept null check (B.1). Updated router comment (B.2). Fixed toast import.

import React from "react";
// Import useParams from next/navigation for App Router context if needed later
import { useProductDetail } from "@/hooks/queries/useProductDetail";
import { useAddToCart } from "@/hooks/mutations/useAddToCart";
import ProductDetailView from "@/components/product/ProductDetailView";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner"; // CORRECTED: Import toast from sonner
import { useCartStore } from "@/store/useCartStore"; // Example: Assumes cartId is in Zustand store (FE-BL-003)
import type { AxiosError } from "axios"; // Import AxiosError type

interface ProductDetailContainerProps {
  handleOrId: string;
}

/**
 * Container component responsible for fetching single product detail data
 * using the useProductDetail hook and handling loading/error states.
 * Renders the ProductDetailView component with the fetched data and handles add to cart actions.
 */
const ProductDetailContainer: React.FC<ProductDetailContainerProps> = ({
  handleOrId,
}) => {
  // const { toast } = useToast(); // REMOVED: Old shadcn/ui toast hook
  const { data, isLoading, isError, error } = useProductDetail(handleOrId);
  const { mutate: addToCartMutate, isPending: isAddingToCart } = useAddToCart();

  // Retrieve cartId from global state (Rec A.1)
  // **VERIFY:** This implementation assumes cartId is stored in Zustand. Adapt as necessary based on actual cart state management.
  const cartId = useCartStore((state) => state.cartId); // Example retrieval

  const handleAddToCart = (variantId: string, quantity: number) => {
    if (!cartId) {
      console.error("Cart ID is missing, cannot add item.");
      toast.error("Error Adding to Cart", {
        // CORRECTED: Use sonner toast function
        description:
          "Could not find your cart. Please try refreshing the page.",
        // Sonner does not use 'variant' prop directly like shadcn/ui toast. Severity is part of the function call.
      });
      return;
    }
    addToCartMutate(
      {
        cartId: cartId,
        item: { variant_id: variantId, quantity: quantity },
      },
      {
        // React Query mutation callbacks
        onSuccess: () => {
          toast.success("Item Added!", {
            description: `${
              product?.title || "Product"
            } has been added to your cart.`,
          });
        },
        onError: (err: any) => {
          const errorMessage =
            err?.response?.data?.error?.message ||
            err?.structuredError?.message ||
            "Could not add item to cart. Please try again.";
          toast.error("Failed to Add Item", {
            description: errorMessage,
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div
        className="grid md:grid-cols-2 gap-8 lg:gap-12"
        data-testid="product-detail-loading"
      >
        <div className="space-y-4">
          <Skeleton className="aspect-square w-full rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-16 w-16 rounded" />
            <Skeleton className="h-16 w-16 rounded" />
            <Skeleton className="h-16 w-16 rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-5 w-1/4" />
          <Skeleton className="h-10 w-1/3" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 flex-1" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (isError) {
    // Use structured error message from interceptor if available (Rec A.2)
    const axiosError = error as AxiosError<{
      // Keep type assertion for structuredError
      error?: { message?: string; code?: string; details?: any }; // More specific backend error structure
      structuredError?: { message: string };
    }>;
    const message =
      axiosError.response?.data?.error?.message || // Check backend specific error
      axiosError.response?.data?.structuredError?.message || // Check structuredError
      error?.message ||
      "Could not load product details at this time. Please try again later.";
    return (
      <Alert variant="destructive" data-testid="product-detail-error">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Product</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }

  // Keeping null check as safety fallback (Ref Optional B.1)
  const product = data?.product; // Define product here for use in onSuccess toast
  if (!product) {
    return <p data-testid="product-detail-not-found">Product not found.</p>;
  }

  return (
    <ProductDetailView
      product={product}
      onAddToCart={handleAddToCart}
      isAddingToCart={isAddingToCart}
    />
  );
};

export default ProductDetailContainer;
/* END OF FILE frontend/components/product/ProductDetailContainer.tsx */
