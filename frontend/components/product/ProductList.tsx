// FILE: frontend/components/product/ProductList.tsx
// Rationale: Displays grid/list of product cards. Task ID: Implied by FE-039
// Status: No mandatory changes required based on analysis.
import * as React from "react";
import { ProductSummary } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: ProductSummary[];
}

/**
 * Renders a list or grid of ProductCard components.
 * Expects an array of product summaries.
 */
const ProductList: React.FC<ProductListProps> = ({ products }) => {
  if (!products || products.length === 0) {
    return <p data-testid="product-list-empty">No products found.</p>;
  }

  return (
    <div
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      data-testid="product-list"
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
