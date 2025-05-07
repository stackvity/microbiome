// File: frontend/types/product.ts
// Task ID: FE-018 (US-FE-011 - Core Utilities & Types)
// Description: Defines core TypeScript types and interfaces related to Product entities.
// Status: Revised - Added product.handle to ProductVariant for CartLineItem linking.

/**
 * Represents the structure for displaying a price amount.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PRICE-001 schema.
 */
export interface Price {
  amount: number; // Amount in smallest currency unit (e.g., cents)
  currency_code: string; // ISO 4217 currency code
}

/**
 * Represents a summarized version of a product variant.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PROD-003 schema.
 */
export interface ProductVariantSummary {
  id: string; // UUID
  title: string;
  sku?: string | null;
  inventory_quantity?: number; // Represents calculated available stock
  prices?: Price[];
}

/**
 * Represents a summarized version of a product for listing pages.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PROD-001 schema.
 */
export interface ProductSummary {
  id: string; // UUID
  title: string;
  handle: string | null;
  thumbnail?: string | null;
  variants?: ProductVariantSummary[];
}

/**
 * Represents a specific value for a product option (e.g., "Large").
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PROD-004 schema.
 */
export interface ProductOptionValue {
  id: string; // UUID
  value: string;
  option_id: string; // UUID of the parent ProductOption
  variant_id: string; // UUID of the ProductVariant this value defines
}

/**
 * Represents a product option type (e.g., "Size").
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-STRC-004 schema.
 */
export interface ProductOption {
  id: string; // UUID
  title: string;
  product_id: string; // UUID of the parent Product
  values?: ProductOptionValue[];
}

/**
 * Represents a product image.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-CONF-004 schema.
 */
export interface Image {
  id: string; // UUID
  url: string; // URL
  // metadata?: { alt?: string } | null;
}

/**
 * Represents the detailed structure of a product variant.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PROD-003 schema.
 */
export interface ProductVariant extends ProductVariantSummary {
  product_id: string; // UUID
  barcode?: string | null;
  manage_inventory?: boolean;
  allow_backorder?: boolean;
  options?: ProductOptionValue[];
  product: {
    // ADDED THIS to include parent product's handle
    handle: string | null;
    // id: string; // Could be added if needed
    // title: string; // Could be added if needed
  };
}

/**
 * Represents the full structure of a product for detail pages.
 * Note: Verify fields/nullability against PRD-API-006 responses & DB-PROD-001 schema.
 */
export interface Product extends ProductSummary {
  subtitle?: string | null;
  description?: string | null;
  status?: string;
  images?: Image[];
  options?: ProductOption[];
  variants?: ProductVariant[]; // Ensure this includes detailed variant info if needed
  vendor_name?: string | null;
  average_rating?: number | null;
  review_count?: number | null;
}
