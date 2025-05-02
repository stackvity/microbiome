// File: frontend/types/index.ts
// --- START OF FILE ---
// Revision based on recommendations A.2, B.2, B.3.
// Defines core shared types with minimal comments, inferring structure.

/**
 * Represents core user information obtained after authentication.
 * Based on common user session data and Medusa Customer entity.
 */
export interface User {
  id: string; // Typically UUID from User/Customer record
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  role?: "customer" | "vendor" | "admin"; // Reflecting distinct roles
  vendorStatus?: "pending" | "approved" | "rejected" | null; // Relevant for vendors
  // Add other fields available in session or user profile API response
}

/**
 * Represents a product variant option (e.g., Size: Large).
 * Based on Medusa ProductOptionValue structure.
 */
export interface ProductOptionValue {
  id: string; // UUID of the option value record
  value: string; // e.g., "Large", "Red", "500mg"
  option_id: string; // FK to ProductOption definition
}

/**
 * Represents a product variant, a specific purchasable version of a product.
 * Based on Medusa ProductVariant entity.
 */
export interface ProductVariant {
  id: string; // UUID of the variant record
  title: string; // e.g., "Large / Red", "500mg"
  sku?: string | null;
  manage_inventory: boolean;
  inventory_quantity: number; // Available quantity (often calculated)
  allow_backorder: boolean;
  unit_price?: number | null; // Price in cents, often resolved based on context
  options?: ProductOptionValue[]; // Values defining this variant
  // Add other relevant fields like barcode, weight, dimensions if needed frontend-wide
}

/**
 * Represents a summarized product view, typically for listing pages.
 * Based on Medusa Product entity.
 */
export interface ProductSummary {
  id: string; // UUID of the product record
  title: string;
  handle: string; // URL slug
  thumbnail?: string | null; // URL of the primary image
  // Include the default or first available variant for display price/options
  variants: ProductVariant[]; // Often includes just one default/cheapest variant summary
  // Add other summary fields like average rating if available
}

/**
 * Represents a detailed product view.
 * Extends ProductSummary with more details. Based on Medusa Product entity.
 */
export interface ProductDetail extends ProductSummary {
  subtitle?: string | null;
  description?: string | null;
  images: { id: string; url: string; alt?: string }[]; // Array of image objects
  options?: {
    id: string;
    title: string;
    values: { id: string; value: string }[];
  }[]; // Options defined for the product
  // Override variants to ensure all are included for detail view
  variants: ProductVariant[]; // All variants for selection
  vendorName?: string; // If multi-vendor
  // Add ingredient lists, detailed specs, etc.
}

/**
 * Represents an item within a shopping cart or an order.
 * Based on Medusa LineItem entity structure.
 */
export interface LineItem {
  id: string; // UUID of the line item record
  variant_id?: string | null; // Link to ProductVariant
  title: string; // Product title snapshot
  description: string; // Variant title snapshot
  thumbnail?: string | null; // Thumbnail snapshot
  quantity: number;
  unit_price: number; // Price per unit snapshot (in cents)
  // Add calculated totals if returned by API (e.g., line total)
  // Add fulfillment status fields if representing an OrderLineItem
}

/**
 * Represents the shopping cart.
 * Based on Medusa Cart entity structure.
 */
export interface Cart {
  id: string; // UUID of the cart record
  items: LineItem[]; // Array of line items in the cart
  subtotal: number; // Sum of line item totals (in cents)
  discount_total?: number; // In cents
  shipping_total?: number; // In cents
  tax_total?: number; // In cents
  total: number; // Final total (in cents)
  // Add other relevant fields like associated user_id, email, addresses, shipping methods
}

/**
 * Represents a placed order summary view.
 * Based on Medusa Order entity structure.
 */
export interface OrderSummary {
  id: string; // UUID of the order record
  display_id: number; // User-friendly sequential ID
  created_at: string | Date; // ISO string or Date object
  status: string; // e.g., 'pending', 'completed'
  fulfillment_status: string; // e.g., 'not_fulfilled', 'shipped'
  payment_status: string; // e.g., 'awaiting', 'captured'
  total: number; // Final total in cents
  currency_code: string;
}

/**
 * Represents detailed order information.
 * Extends OrderSummary. Based on Medusa Order entity structure.
 */
export interface OrderDetail extends OrderSummary {
  items: LineItem[]; // Detailed line items for this order
  shipping_address?: Address | null; // Snapshotted or linked Address
  billing_address?: Address | null; // Snapshotted or linked Address
  shipping_methods?: { price: number; shipping_option?: { name: string } }[]; // Details of selected method
  payments?: { amount: number; status: string; provider_id: string }[]; // Associated payment info
  // Add other details like customer info, discounts applied etc.
}

/**
 * Represents address information.
 * Based on Medusa Address entity structure.
 */
export interface Address {
  id: string; // UUID of the address record
  user_id?: string; // Link back to user if saved
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  province?: string | null; // State/Province
  postal_code: string;
  country_code: string; // ISO 2 code
  phone?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

/**
 * Represents an active subscription summary view.
 * Based on local Subscription record potentially enriched by Stripe data.
 */
export interface ActiveSubscription {
  id: string; // Local DB Subscription ID
  stripe_subscription_id: string; // Stripe Subscription ID
  status: string; // e.g., 'ACTIVE', 'TRIALING'
  current_period_end: string | Date; // Next billing date
  plan_details?: {
    product_name?: string;
    product_thumbnail?: string | null;
    interval?: string; // e.g., 'month'
    interval_count?: number;
    amount?: number; // Price in cents
    currency_code?: string;
  };
}

/**
 * Represents the metadata and result of an AI Test Result Analysis.
 * Based on DB-AI-001: TestResult structure.
 */
export interface TestResultAnalysis {
  id: string; // UUID of the TestResult record
  user_id: string;
  filename: string;
  file_type: string;
  storage_ref: string;
  status: "UPLOADED" | "PROCESSING" | "COMPLETED" | "FAILED";
  ai_summary_text?: string | null;
  error_message?: string | null;
  uploaded_at: string | Date;
  processed_at?: string | Date | null;
  created_at: string | Date;
  updated_at: string | Date;
}

// --- END OF FILE ---
