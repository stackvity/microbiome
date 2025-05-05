// File: frontend/lib/zodSchemas.ts
// Task IDs: FE-019, FE-045, FE-046, FE-047, FE-048
// Description: Central definitions for Zod validation schemas used with react-hook-form.
// Status: Revised based on analysis findings (Recommendations A.4, B.2, B.3). Added basic phone pattern, enhanced URL validation, added JSDoc.

import { z } from "zod";

// --- Base Schemas ---

/**
 * Base schema for validating email addresses.
 */
export const EmailSchema = z
  .string()
  .email({ message: "Please enter a valid email address." })
  .min(1, { message: "Email is required." });

/**
 * Base schema for validating passwords (minimum length).
 * Ref: BR-UM-002
 */
export const PasswordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." });

/**
 * Base schema for validating non-empty strings.
 */
export const RequiredStringSchema = z
  .string()
  .min(1, { message: "This field is required." });

// Basic North American phone number pattern - adjust if more complex international validation needed later
const basicPhoneRegex = new RegExp(
  /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
);

// --- Form Specific Schemas ---

/**
 * Schema for the Login form.
 */
export const LoginSchema = z.object({
  email: EmailSchema,
  password: RequiredStringSchema.min(1, { message: "Password is required." }),
});

/**
 * Schema for the Customer Registration form, including password confirmation.
 */
export const CustomerRegisterSchema = z
  .object({
    first_name: RequiredStringSchema.max(255),
    last_name: RequiredStringSchema.max(255),
    email: EmailSchema,
    password: PasswordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Apply error to confirmPassword field
  });

/**
 * Schema for the Vendor Registration form, extending customer fields with business details.
 * Note: Field optionality/requirements should align with REG-API-003 contract.
 */
export const VendorRegisterSchema = CustomerRegisterSchema.extend({
  business_name: RequiredStringSchema.max(255),
  business_address_1: RequiredStringSchema.max(255),
  business_city: RequiredStringSchema.max(100),
  business_postal_code: RequiredStringSchema.max(20),
  business_country_code: RequiredStringSchema.length(2, {
    message: "Country code must be 2 letters.",
  }),
  business_province: z.string().max(100).optional().nullable(),
  business_website: z
    .string()
    .url({ message: "Please enter a valid URL (e.g., https://example.com)." })
    .optional()
    .or(z.literal("")), // Allows empty string or valid URL
  tax_id: z.string().max(100).optional().nullable(),
  phone: z
    .string()
    .max(50)
    .optional()
    .nullable()
    .refine((val) => !val || basicPhoneRegex.test(val), {
      message: "Please enter a valid phone number.", // Basic format validation
    }),
}).omit({ confirmPassword: true }); // Exclude confirmPassword from the final Vendor object if needed by backend

/**
 * Schema for the Address form, used in user profile and potentially checkout.
 * Aligned with DB-USER-003.
 */
export const AddressSchema = z.object({
  first_name: RequiredStringSchema.max(255),
  last_name: RequiredStringSchema.max(255),
  address_1: RequiredStringSchema.max(255),
  address_2: z.string().max(255).optional().nullable(),
  city: RequiredStringSchema.max(100),
  postal_code: RequiredStringSchema.max(20),
  country_code: RequiredStringSchema.length(2, {
    message: "Country code must be 2 letters.",
  }),
  province: z.string().max(100).optional().nullable(),
  phone: z
    .string()
    .max(50)
    .optional()
    .nullable()
    .refine((val) => !val || basicPhoneRegex.test(val), {
      message: "Please enter a valid phone number.", // Basic format validation
    }),
  company: z.string().max(255).optional().nullable(),
});

// --- Reusable Types derived from Schemas ---
export type LoginUserInput = z.infer<typeof LoginSchema>;
export type CustomerRegisterUserInput = z.infer<typeof CustomerRegisterSchema>;
export type VendorRegisterUserInput = z.infer<typeof VendorRegisterSchema>;
export type AddressInputSchema = z.infer<typeof AddressSchema>;
