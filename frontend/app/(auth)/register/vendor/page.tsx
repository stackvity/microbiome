// --- START OF FILE frontend/app/(auth)/register/vendor/page.tsx ---
// Revision incorporates Recommendations A.2, A.3, A.4, B.1

"use client"; // Required for client-side hooks and event handling

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// NOTE: Assuming specific Zod schema defined in lib/zodSchemas.ts (as per FE-BL-003/US-FE-011)
// import { vendorRegisterSchema } from '@/lib/zodSchemas'; // Needs verification
// NOTE: Assuming mutation hook defined in hooks/mutations/ (as per FE-BL-006/US-FE-018 pattern)
// import { useRegisterVendorMutation } from '@/hooks/mutations/useRegisterVendorMutation'; // Needs verification
import { Button } from "@/components/ui/button"; // FE-BL-005/US-FE-014
import { Input } from "@/components/ui/input"; // FE-BL-005/US-FE-014
import { Label } from "@/components/ui/label"; // FE-BL-005/US-FE-014
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // FE-BL-005/US-FE-015
import { Spinner } from "@/components/ui/spinner"; // FE-BL-005/US-FE-016
import { Textarea } from "@/components/ui/textarea"; // FE-BL-005/US-FE-014 (Assuming needed for biz details)

// Define Zod schema locally for demonstration if import not available
// Replace with actual import from lib/zodSchemas.ts
// NOTE: This needs to include all required business fields from VP.1.1/DB-USER-006
const vendorRegisterSchema = z
  .object({
    // User fields
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    phone: z.string().optional(), // Optional user phone
    // Business fields (Examples - align with backend DTO / DB-USER-006)
    businessName: z.string().min(2, { message: "Business name is required." }),
    businessWebsite: z
      .string()
      .url({ message: "Please enter a valid URL." })
      .optional()
      .or(z.literal("")), // Optional URL
    // Add other business fields here based on API requirements (address, tax ID, etc.)
    // e.g., business_address_1: z.string().min(1, { message: "Address is required." }),
    //       business_city: z.string().min(1, { message: "City is required." }),
    //       business_postal_code: z.string().min(1, { message: "Postal code is required." }),
    //       business_country_code: z.string().min(2, { message: "Country is required."}),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Path of error
  });

type VendorRegisterFormValues = z.infer<typeof vendorRegisterSchema>;

/**
 * Renders the Vendor Registration page with form handling and validation.
 * Tasks: FE-017, FE-044, FE-047, FE-049, FE-056
 */
export default function VendorRegistrationPage() {
  // NOTE: Placeholder for actual registration mutation hook
  const {
    mutate: registerVendor,
    isPending,
    error: mutationError,
  } = {
    mutate: (data: any) => console.log("Simulating Vendor Register:", data),
    isPending: false,
    error: null,
  }; // useRegisterVendorMutation();

  const form = useForm<VendorRegisterFormValues>({
    resolver: zodResolver(vendorRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      businessName: "",
      businessWebsite: "",
      // Initialize other business fields...
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  const onSubmit = async (data: VendorRegisterFormValues) => {
    console.log("Vendor registration form submitted:", data);
    // Destructure to exclude confirmPassword before sending to backend
    const { confirmPassword, ...submitData } = data;

    // In a real implementation, call the mutation hook
    // registerVendor(submitData, {
    //   onSuccess: () => {
    //     // Handle successful application submission (e.g., redirect to message page)
    //     console.log("Vendor registration successful");
    //     // Redirect to a page indicating application is under review
    //     // router.push('/register/vendor/pending'); // Example using next/navigation
    //   },
    //   onError: (error: any) => {
    //     // Handle server-side errors (e.g., email already exists)
    //     console.error("Vendor registration failed:", error);
    //     setError("root.serverError", {
    //       type: "manual",
    //       message: error.response?.data?.message || "Application submission failed. Please try again.",
    //     });
    //   }
    // });
  };

  return (
    <Card className="w-full max-w-md">
      {" "}
      {/* Wider card for more fields */}
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Apply to be a Vendor</CardTitle>
        <CardDescription>
          Complete the form below to apply. Applications are subject to review.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {/* Display general server errors */}
        {(mutationError || errors.root?.serverError) && (
          <p role="alert" className="text-sm font-medium text-destructive">
            {(mutationError as any)?.message ||
              errors.root?.serverError?.message ||
              "An unexpected error occurred."}
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          {/* Contact Person Details */}
          <h3 className="text-lg font-semibold border-b pb-2">
            Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="David"
                {...register("firstName")}
                aria-invalid={errors.firstName ? "true" : "false"}
                aria-describedby="firstName-error"
              />
              {errors.firstName && (
                <p
                  id="firstName-error"
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Chen"
                {...register("lastName")}
                aria-invalid={errors.lastName ? "true" : "false"}
                aria-describedby="lastName-error"
              />
              {errors.lastName && (
                <p
                  id="lastName-error"
                  role="alert"
                  className="text-sm font-medium text-destructive"
                >
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="david@harmony.com"
              {...register("email")}
              aria-invalid={errors.email ? "true" : "false"}
              aria-describedby="email-error"
            />
            {errors.email && (
              <p
                id="email-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Contact Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              {...register("phone")}
              aria-invalid={errors.phone ? "true" : "false"}
              aria-describedby="phone-error"
            />
            {errors.phone && (
              <p
                id="phone-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Account Credentials */}
          <h3 className="text-lg font-semibold border-b pb-2 pt-4">
            Account Credentials
          </h3>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register("password")}
              aria-invalid={errors.password ? "true" : "false"}
              aria-describedby="password-error"
            />
            {errors.password && (
              <p
                id="password-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              aria-invalid={errors.confirmPassword ? "true" : "false"}
              aria-describedby="confirmPassword-error"
            />
            {errors.confirmPassword && (
              <p
                id="confirmPassword-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Business Details */}
          <h3 className="text-lg font-semibold border-b pb-2 pt-4">
            Business Information
          </h3>
          <div className="grid gap-2">
            <Label htmlFor="businessName">Business Name</Label>
            <Input
              id="businessName"
              placeholder="Gut Harmony Supplements"
              {...register("businessName")}
              aria-invalid={errors.businessName ? "true" : "false"}
              aria-describedby="businessName-error"
            />
            {errors.businessName && (
              <p
                id="businessName-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.businessName.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="businessWebsite">Business Website (Optional)</Label>
            <Input
              id="businessWebsite"
              type="url"
              placeholder="https://harmony.example.com"
              {...register("businessWebsite")}
              aria-invalid={errors.businessWebsite ? "true" : "false"}
              aria-describedby="businessWebsite-error"
            />
            {errors.businessWebsite && (
              <p
                id="businessWebsite-error"
                role="alert"
                className="text-sm font-medium text-destructive"
              >
                {errors.businessWebsite.message}
              </p>
            )}
          </div>
          {/* Add other business address fields, tax ID fields etc. here using Input, Textarea, Select as needed */}
          {/* Example Address Field */}
          {/* <div className="grid gap-2">
            <Label htmlFor="businessAddress1">Business Address</Label>
            <Input id="businessAddress1" placeholder="123 Wellness Way" {...register("business_address_1")} />
            ... more address fields (city, state, zip, country) ...
          </div> */}

          <Button type="submit" className="w-full mt-4" disabled={isPending}>
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            Submit Application
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center text-sm">
        {/* Link to Login (Recommendation B.1) */}
        <div className="text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline hover:text-primary">
            Login
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
// --- END OF FILE frontend/app/(auth)/register/vendor/page.tsx ---
