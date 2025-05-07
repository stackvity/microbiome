/* START OF FILE frontend/components/auth/RegisterForm.tsx */
// File: frontend/components/auth/RegisterForm.tsx
// Task IDs: Implied by FE-043, FE-044, FE-046, FE-047, FE-049, FE-056
// Description: Component rendering registration forms (Customer/Vendor), integrating RHF/Zod.
// Status: Revised - Corrected typedSchema assignment to resolve TS2352. Existing casts for error handling retained.

"use client";

import React from "react";
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  DeepPartial,
  DefaultValues,
  Path,
  FieldErrors, // Import FieldErrors for type casting
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CustomerRegisterSchema, VendorRegisterSchema } from "@/lib/zodSchemas";
import type {
  CustomerRegisterUserInput,
  VendorRegisterUserInput,
} from "@/lib/zodSchemas";
import { Spinner } from "@/components/ui/spinner";

type RegisterFormData = CustomerRegisterUserInput | VendorRegisterUserInput;

interface RegisterFormProps<T extends RegisterFormData> {
  formType: "customer" | "vendor";
  onSubmit: (data: T) => void;
  isPending?: boolean;
  formInstance?: UseFormReturn<T>;
}

/**
 * Displays the registration form for either customers or vendors.
 * Integrates React Hook Form, Zod validation, and shadcn/ui components.
 */
const RegisterForm = <T extends RegisterFormData>({
  formType,
  onSubmit,
  isPending = false,
  formInstance,
}: RegisterFormProps<T>) => {
  // Corrected typedSchema assignment
  const typedSchema = (formType === "customer"
    ? CustomerRegisterSchema
    : VendorRegisterSchema) as unknown as z.ZodType<T, any, T>;

  const getSpecificDefaultValues = (): DeepPartial<T> => {
    const commonDefaults: DeepPartial<CustomerRegisterUserInput> = {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "", // Required by CustomerRegisterUserInput
    };

    if (formType === "vendor") {
      // VendorRegisterUserInput does not have confirmPassword.
      // We construct defaults based on its actual fields.
      const vendorDefaults: DeepPartial<VendorRegisterUserInput> = {
        first_name: commonDefaults.first_name,
        last_name: commonDefaults.last_name,
        email: commonDefaults.email,
        password: commonDefaults.password,
        // no confirmPassword here as it's omitted in VendorRegisterSchema
        business_name: "",
        business_address_1: "",
        business_city: "",
        business_postal_code: "",
        business_country_code: "",
        business_province: "",
        business_website: "",
        tax_id: "",
        phone: "",
      };
      return vendorDefaults as DeepPartial<T>;
    }
    return commonDefaults as DeepPartial<T>;
  };

  const defaultFormValues: DeepPartial<T> = getSpecificDefaultValues();

  const internalForm = useForm<T, any, T>({
    resolver: zodResolver(typedSchema),
    defaultValues: defaultFormValues as DefaultValues<T>,
  });

  const form = formInstance || internalForm;

  const handleFormSubmit: SubmitHandler<T> = (data) => {
    if (!isPending) {
      onSubmit(data);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        {/* --- Common Fields --- */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name={"first_name" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    value={field.value ?? ""}
                    data-testid="first-name-input"
                    aria-required="true"
                    aria-describedby="first-name-error"
                    aria-invalid={
                      !!(form.formState.errors as FieldErrors<RegisterFormData>)
                        .first_name
                    }
                  />
                </FormControl>
                <FormMessage id="first-name-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"last_name" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    value={field.value ?? ""}
                    data-testid="last-name-input"
                    aria-required="true"
                    aria-describedby="last-name-error"
                    aria-invalid={
                      !!(form.formState.errors as FieldErrors<RegisterFormData>)
                        .last_name
                    }
                  />
                </FormControl>
                <FormMessage id="last-name-error" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name={"email" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  value={field.value ?? ""}
                  data-testid="email-input"
                  aria-required="true"
                  aria-describedby="reg-email-error"
                  aria-invalid={
                    !!(form.formState.errors as FieldErrors<RegisterFormData>)
                      .email
                  }
                />
              </FormControl>
              <FormMessage id="reg-email-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={"password" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  value={field.value ?? ""}
                  data-testid="password-input"
                  aria-required="true"
                  aria-describedby="reg-password-error"
                  aria-invalid={
                    !!(form.formState.errors as FieldErrors<RegisterFormData>)
                      .password
                  }
                />
              </FormControl>
              <FormMessage id="reg-password-error" />
            </FormItem>
          )}
        />

        {/* Conditionally render confirmPassword field ONLY for "customer" formType */}
        {formType === "customer" && (
          <FormField
            control={form.control} // When formType is 'customer', form.control is Control<CustomerRegisterUserInput, any>
            name={"confirmPassword" as Path<T>} // `confirmPassword` is a valid Path for CustomerRegisterUserInput
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    value={(field.value as string) ?? ""} // Value will be a string for this field
                    data-testid="confirm-password-input"
                    aria-required="true"
                    aria-describedby="confirm-password-error"
                    // When formType is 'customer', form.formState.errors is FieldErrors<CustomerRegisterUserInput>
                    aria-invalid={
                      !!(
                        form.formState
                          .errors as FieldErrors<CustomerRegisterUserInput>
                      ).confirmPassword
                    }
                  />
                </FormControl>
                <FormMessage id="confirm-password-error" />
              </FormItem>
            )}
          />
        )}

        {/* --- Vendor Specific Fields --- */}
        {formType === "vendor" && (
          <>
            <h2 className="text-lg font-semibold pt-4 border-t">
              Business Details
            </h2>
            <FormField
              control={form.control}
              name={"phone" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="123-456-7890"
                      {...field}
                      value={field.value ?? ""}
                      aria-describedby="vendor-phone-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).phone
                      }
                    />
                  </FormControl>
                  <FormMessage id="vendor-phone-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_name" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Acme Health Supplies"
                      {...field}
                      value={field.value ?? ""}
                      aria-required="true"
                      aria-describedby="business-name-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_name
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-name-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_address_1" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Address 1</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="100 Business Rd"
                      {...field}
                      value={field.value ?? ""}
                      aria-required="true"
                      aria-describedby="business-address1-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_address_1
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-address1-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_city" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Metropolis"
                      {...field}
                      value={field.value ?? ""}
                      aria-required="true"
                      aria-describedby="business-city-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_city
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-city-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_postal_code" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Postal Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="90210"
                      {...field}
                      value={field.value ?? ""}
                      aria-required="true"
                      aria-describedby="business-postal-code-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_postal_code
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-postal-code-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_country_code" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Country Code (2 Letters)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="US"
                      {...field}
                      value={field.value ?? ""}
                      maxLength={2}
                      className="uppercase"
                      aria-required="true"
                      aria-describedby="business-country-code-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_country_code
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-country-code-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_province" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Province/State (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CA"
                      {...field}
                      value={field.value ?? ""}
                      aria-describedby="business-province-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_province
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-province-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"business_website" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Website (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://www.example.com"
                      {...field}
                      value={field.value ?? ""}
                      aria-describedby="business-website-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).business_website
                      }
                    />
                  </FormControl>
                  <FormMessage id="business-website-error" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={"tax_id" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax ID (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Business Tax Identifier"
                      {...field}
                      value={field.value ?? ""}
                      aria-describedby="tax-id-error"
                      aria-invalid={
                        !!(
                          form.formState
                            .errors as FieldErrors<VendorRegisterUserInput>
                        ).tax_id
                      }
                    />
                  </FormControl>
                  <FormMessage id="tax-id-error" />
                </FormItem>
              )}
            />
          </>
        )}

        {/* Display general server errors */}
        {form.formState.errors.root?.serverError && (
          <div className="text-sm font-medium text-destructive" role="alert">
            {form.formState.errors.root.serverError.message}
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          data-testid="register-button"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Processing...
            </>
          ) : formType === "customer" ? (
            "Create Account"
          ) : (
            "Submit Application"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default RegisterForm;
/* END OF FILE frontend/components/auth/RegisterForm.tsx */
