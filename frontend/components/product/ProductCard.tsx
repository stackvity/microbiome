// FILE: frontend/components/product/ProductCard.tsx
// Rationale: Displays summary information for a single product in lists/grids. Task ID: Implied by FE-039
// Status: Revised - Applied Recommendations A.1, A.2.
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ProductSummary } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Button";

interface ProductCardProps {
  product: ProductSummary;
}

/**
 * Displays a summary card for a product, linking to its detail page.
 */
const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  if (!product) {
    return null;
  }

  // Recommendation A.2: Safer price extraction
  const displayPrice = product.variants?.[0]?.prices?.[0];

  // Recommendation A.1: Verified placeholder path (assuming it exists)
  const imageUrl = product.thumbnail || "/images/placeholder.png";

  return (
    <Card
      className="flex flex-col overflow-hidden transition-shadow duration-200 hover:shadow-md"
      data-testid={`product-card-${product.handle || product.id}`}
    >
      <Link href={`/products/${product.handle || product.id}`} legacyBehavior>
        <a className="block aspect-square relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={product.title} // Alt text is important for accessibility
            layout="fill"
            objectFit="cover"
            className="hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </a>
      </Link>
      <CardHeader className="p-4">
        <CardTitle className="text-base font-semibold leading-tight line-clamp-2 h-[2.5rem]">
          <Link
            href={`/products/${product.handle || product.id}`}
            legacyBehavior
          >
            <a className="hover:text-primary">{product.title}</a>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-0">
        {/* Recommendation A.2: Conditional rendering and formatting */}
        {displayPrice ? (
          <p className="text-lg font-bold text-primary">
            {formatCurrency(displayPrice.amount, displayPrice.currency_code)}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">Price unavailable</p>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" asChild className="w-full">
          <Link href={`/products/${product.handle || product.id}`}>
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
