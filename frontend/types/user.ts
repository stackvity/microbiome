// File: frontend/types/user.ts
// Task ID: FE-018 (US-FE-011 - Core Utilities & Types)
// Description: Defines core TypeScript types and interfaces related to User and Address entities.
// Status: Revised - Added more specific JSDoc comments. Type details require ongoing verification against API/DB.

/**
 * Represents the structure of a user address.
 * Note: Verify fields/nullability against ACC-API-005 responses & DB-USER-003 schema.
 */
export interface Address {
  id: string; // UUID
  user_id: string; // UUID of the associated user
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  postal_code: string;
  country_code: string; // ISO 2-letter code
  province?: string | null;
  phone?: string | null;
  company?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
  // metadata?: Record<string, unknown> | null;
}

/**
 * Represents the core user data structure used in the frontend.
 * Note: Verify fields/nullability against AUT-API-002, ACC-API-005, USR-API-013 responses & DB-USER-001 schema.
 */
export interface User {
  id: string; // UUID
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: "customer" | "vendor" | "admin";
  vendor_status?: "pending" | "approved" | "rejected" | null; // Only if role is 'vendor'
  stripe_connect_account_id?: string | null; // Only for vendors
  shipping_addresses?: Address[];
  // metadata?: Record<string, unknown> | null;
}

/**
 * Type helper for creating/updating addresses, omitting system-generated fields.
 */
export type AddressInput = Omit<
  Address,
  "id" | "user_id" | "is_default_shipping" | "is_default_billing"
>;
