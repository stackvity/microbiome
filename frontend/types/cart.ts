// File: frontend/types/cart.ts
// Task ID: FE-018 (US-FE-011 - Core Utilities & Types)
// Description: Defines core TypeScript types and interfaces related to Cart and LineItem entities.
// Status: Revised - Added more specific JSDoc comments. Type details require ongoing verification against API/DB.

import type { ProductVariantSummary } from "./product";
import type { Address } from "./user";

/**
 * Represents a shipping option available during checkout.
 * Note: Verify fields/nullability against CRT-API-008 responses & DB-SHIP-001 schema.
 */
export interface ShippingOption {
  id: string; // UUID (so_...)
  name: string;
  amount?: number; // Price in cents
  price_type?: "flat_rate" | "calculated";
}

/**
 * Represents a selected Shipping Method applied to a cart or order.
 * Note: Verify fields/nullability against CRT-API-008 responses & DB-CART-003 schema.
 */
export interface ShippingMethod {
  id: string; // UUID (shipm_...)
  shipping_option_id: string;
  price: number; // Snapshotted price in cents
  shipping_option?: ShippingOption; // Often includes nested details
}

/**
 * Represents a line item within a cart or order.
 * Note: Verify fields/nullability against CRT-API-008 responses & DB-CART-002 schema.
 */
export interface LineItem {
  id: string; // UUID (item_...)
  cart_id?: string | null;
  order_id?: string | null;
  variant_id?: string | null; // UUID of the ProductVariant
  title: string; // Product title snapshot
  description: string; // Variant title snapshot
  thumbnail?: string | null; // Thumbnail URL snapshot
  quantity: number;
  unit_price: number; // Price per unit in cents (snapshot)
  allow_discounts?: boolean;
  variant?: ProductVariantSummary;
  // Calculated totals (may come from API)
  subtotal?: number;
  total?: number;
}

/**
 * Represents the main shopping cart structure.
 * Note: Verify fields/nullability against CRT-API-008 responses & DB-CART-001 schema.
 */
export interface Cart {
  id: string; // UUID (cart_...)
  user_id?: string | null;
  email?: string | null;
  region_id?: string | null;
  items: LineItem[];
  shipping_address?: Address | null;
  billing_address?: Address | null;
  shipping_methods?: ShippingMethod[];
  // Calculated totals (may come from API)
  subtotal?: number;
  shipping_total?: number;
  tax_total?: number;
  total?: number;
  // metadata?: Record<string, unknown> | null;
}

/**
 * Input type for adding an item to the cart.
 */
export interface AddToCartInput {
  variant_id: string;
  quantity: number;
  metadata?: Record<string, unknown> | null;
}

/**
 * Input type for updating a cart item's quantity.
 */
export interface UpdateCartItemInput {
  quantity: number;
  metadata?: Record<string, unknown> | null;
}
