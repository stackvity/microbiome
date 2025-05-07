// FILE: frontend/components/product/ProductDetailView.tsx
// Rationale: Displays full details of a product (images, description, price, add-to-cart). Task ID: Implied by FE-040
// Status: Revised - Applied Recommendations A.2, A.4, A.5, B.4 and fixed TS18048.
import * as React from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
// import ImageGallery from './ImageGallery'; // Placeholder for a more complex gallery
import { Input } from "@/components/ui/Input"; // This import was already correct

interface ProductDetailViewProps {
  product: Product;
  onAddToCart: (variantId: string, quantity: number) => void;
  isAddingToCart: boolean;
}

/**
 * Displays the detailed view of a single product.
 * Handles presentation logic, receives data and actions as props.
 */
const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onAddToCart,
  isAddingToCart,
}) => {
  if (!product) {
    return <p>Product not found.</p>;
  }

  // Recommendation A.4: Clarify state management.
  // Local state for variant selection and quantity. Complex logic (option interaction,
  // availability checks based on selection) should be managed in parent container/hooks post-MVP.
  const [selectedVariant, setSelectedVariant] = React.useState(
    product.variants?.[0] ?? null
  );
  const [quantity, setQuantity] = React.useState(1);

  // State for the main displayed image URL, updated on thumbnail click
  const [mainImageUrl, setMainImageUrl] = React.useState(
    product.images?.[0]?.url ?? "/images/placeholder.png" // Recommendation A.1 (Placeholder Path)
  );

  // Update main image if product changes or selected variant changes (if variants have unique images)
  React.useEffect(() => {
    setMainImageUrl(product.images?.[0]?.url ?? "/images/placeholder.png");
    // Optionally reset selected variant/quantity if product prop changes externally
    setSelectedVariant(product.variants?.[0] ?? null);
    setQuantity(1);
  }, [product]);

  // Recommendation A.2: Safer price extraction
  const displayPrice = selectedVariant?.prices?.[0];

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCartClick = () => {
    if (selectedVariant) {
      onAddToCart(selectedVariant.id, quantity);
    } else {
      console.error("No variant selected for adding to cart");
    }
  };

  // Recommendation B.4: Handle thumbnail click
  const handleThumbnailClick = (imageUrl: string) => {
    setMainImageUrl(imageUrl);
  };

  return (
    <div
      className="grid md:grid-cols-2 gap-8 lg:gap-12"
      data-testid="product-detail-view"
    >
      {/* Image Gallery Section */}
      <div>
        {/* Main Image Display */}
        <div className="aspect-square relative mb-4 bg-muted rounded-md overflow-hidden">
          <Image
            src={mainImageUrl}
            alt={product.title} // Main image alt text
            layout="fill"
            objectFit="contain"
            priority
          />
        </div>
        {/* Thumbnail Gallery */}
        {product.images && product.images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto mt-2 pb-2">
            {" "}
            {/* Added pb-2 for scrollbar space */}
            {product.images.map(
              (
                img,
                index // Use index from map
              ) => (
                <button // Use button for accessibility
                  key={img.id}
                  onClick={() => handleThumbnailClick(img.url)}
                  className={`relative w-16 h-16 flex-shrink-0 rounded border overflow-hidden cursor-pointer transition-opacity focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                    mainImageUrl === img.url
                      ? "opacity-100 border-primary"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View image ${
                    index + 1 // Use map index here
                  } for ${product.title}`}
                >
                  <Image
                    src={img.url}
                    alt={`Thumbnail ${
                      index + 1 // Use map index here
                    } for ${product.title}`} // Descriptive alt text
                    layout="fill"
                    objectFit="cover"
                  />
                </button>
              )
            )}
          </div>
        )}
      </div>

      {/* Product Details Section */}
      <div className="space-y-6">
        {/* Title, Vendor, Rating */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{product.title}</h1>
          {product.subtitle && (
            <p className="text-lg text-muted-foreground mt-1">
              {product.subtitle}
            </p>
          )}
          {product.vendor_name && (
            <p className="text-sm text-muted-foreground mt-2">
              Sold by:{" "}
              <span className="font-medium text-foreground">
                {product.vendor_name}
              </span>
            </p>
          )}
          {/* Ensure null/undefined check is robust */}
          {(product.average_rating ?? -1) >= 0 && (
            <div className="flex items-center mt-2">
              {/* Placeholder for star icons */}
              <span className="text-yellow-500 mr-1">★★★★☆</span>
              <span className="text-sm text-muted-foreground">
                {product.average_rating?.toFixed(1)} (
                {product.review_count ?? 0} reviews)
              </span>
            </div>
          )}
        </div>

        <Separator />

        {/* Price */}
        {/* Recommendation A.2: Conditional rendering */}
        {displayPrice ? (
          <p className="text-3xl font-extrabold text-primary">
            {formatCurrency(displayPrice.amount, displayPrice.currency_code)}
          </p>
        ) : (
          <p className="text-lg text-muted-foreground">Price unavailable</p>
        )}

        {/* Variant Selection (Simplified Placeholder) */}
        {/* TODO: Implement proper variant selection UI if multiple variants exist */}
        {product.variants && product.variants.length > 1 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Options:</p>
            {/* Placeholder - Render actual options based on product.options */}
            <Badge variant="secondary">
              {selectedVariant?.title ?? "Default"}
            </Badge>
          </div>
        )}

        {/* Quantity & Add to Cart */}
        <div className="flex items-center gap-4">
          <label
            htmlFor={`quantity-${product.id}`}
            className="text-sm font-medium sr-only"
          >
            {" "}
            {/* Screen reader only label */}
            Quantity:
          </label>
          <Input // Using Input component for better styling consistency
            id={`quantity-${product.id}`}
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            className="w-20 text-center h-10" // Adjusted height to match default button
            aria-label={`Quantity for ${product.title}`} // More descriptive label
          />
          <Button
            onClick={handleAddToCartClick}
            disabled={isAddingToCart || !selectedVariant}
            size="lg"
            className="flex-1"
            data-testid="add-to-cart-button"
          >
            {isAddingToCart ? (
              // Replace text with accessible spinner if available, ensure loading state announced
              <>
                <span
                  className="animate-spin mr-2"
                  role="status"
                  aria-live="polite"
                >
                  ⏳
                </span>{" "}
                Processing...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </div>

        <Separator />

        {/* Description */}
        {product.description && (
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p style={{ whiteSpace: "pre-wrap" }}>{product.description}</p>
            </div>
          </div>
        )}

        {/* Recommendation A.5: Ensure TODOs remain */}
        {/* TODO: Ingredients Section Implementation */}
        {/* TODO: AI Q&A Section Implementation (Capability AI.3.1) */}
      </div>
    </div>
  );
};

export default ProductDetailView;
