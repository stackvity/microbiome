// frontend/lib/zodSchemas.ts
import * as z from "zod";

// Basic Schemas
export const emailSchema = z
  .string()
  .email({ message: "Invalid email address." });
export const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." }); // Ref: BR-UM-002
export const requiredStringSchema = z
  .string()
  .min(1, { message: "This field is required." });

// Login Schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: "Password is required." }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

// Customer Registration Schema
export const customerRegisterSchema = z
  .object({
    firstName: requiredStringSchema.describe("First name"),
    lastName: requiredStringSchema.describe("Last name"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type CustomerRegisterFormValues = z.infer<typeof customerRegisterSchema>;

// Vendor Registration Schema
// TODO (FE-044/FE-047): Verify fields/requiredness match final form & API DTO (DB-USER-006). (Addresses Rec A.2)
export const vendorRegisterSchema = z
  .object({
    // User fields
    firstName: requiredStringSchema.describe("Contact first name"),
    lastName: requiredStringSchema.describe("Contact last name"),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    phone: z.string().optional(),

    // Business fields
    businessName: requiredStringSchema.describe("Business Name"),
    businessWebsite: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")),

    // Business Address Fields
    business_address_1: requiredStringSchema.describe(
      "Business address line 1"
    ),
    business_address_2: z.string().optional(),
    business_city: requiredStringSchema.describe("Business city"),
    business_postal_code: requiredStringSchema.describe("Business postal code"),
    business_country_code: requiredStringSchema
      .min(2, { message: "Country is required." })
      .describe("Business country code (ISO 2)"),
    business_province: z.string().optional(),

    // Optional Business Fields
    tax_id: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
export type VendorRegisterFormValues = z.infer<typeof vendorRegisterSchema>;

// Address Schema
// TODO (FE-048): Verify fields/requiredness match final form & API DTO (DB-USER-003). (Addresses Rec A.2)
// Note: Complex postal code validation is primarily a backend concern. Basic client-side checks added via refine (Rec B.2).
export const addressSchema = z
  .object({
    first_name: requiredStringSchema.describe("First name"),
    last_name: requiredStringSchema.describe("Last name"),
    address_1: requiredStringSchema.describe("Address line 1"),
    address_2: z.string().optional(),
    city: requiredStringSchema.describe("City"),
    postal_code: requiredStringSchema.describe("Postal code"),
    country_code: requiredStringSchema
      .min(2, { message: "Please select a country." })
      .describe("Country"),
    province: z.string().optional(),
    phone: z.string().optional(),
  })
  // Example of basic conditional validation for specific countries (Rec B.2)
  .refine(
    (data) => {
      // Basic US ZIP Code check (simple 5 digit, allows optional -4)
      if (data.country_code.toUpperCase() === "US") {
        return /^\d{5}(-\d{4})?$/.test(data.postal_code);
      }
      return true; // Skip validation for other countries or if country not US
    },
    {
      message: "Invalid US ZIP code format.",
      path: ["postal_code"],
    }
  )
  .refine(
    (data) => {
      // Basic Canadian Postal Code check
      if (data.country_code.toUpperCase() === "CA") {
        return /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/.test(data.postal_code);
      }
      return true; // Skip validation for other countries or if country not CA
    },
    {
      message: "Invalid Canadian postal code format.",
      path: ["postal_code"],
    }
  );
// TODO (FE-048): Add province requirement validation based on country if needed client-side.

export type AddressFormValues = z.infer<typeof addressSchema>;
