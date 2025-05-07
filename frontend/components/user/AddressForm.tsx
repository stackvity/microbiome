/* START OF FILE frontend/components/user/AddressForm.tsx */
// File: frontend/components/user/AddressForm.tsx
// Task IDs: FE-048, FE-050
// Description: Reusable form component for adding/editing addresses using React Hook Form and Zod validation.
// Status: Revised - Corrected Input and Label import casing, and AddressInputSchema import path.

"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label"; // CORRECTED CASING HERE
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AddressSchema } from "@/lib/zodSchemas";
import type { AddressInputSchema } from "@/lib/zodSchemas"; // CORRECTED IMPORT PATH
import { Spinner } from "@/components/ui/spinner";

interface AddressFormProps {
  onSubmit: (data: AddressInputSchema) => void;
  initialData?: Partial<AddressInputSchema>;
  isLoading?: boolean;
  submitButtonText?: string;
}

/**
 * A reusable form for creating or editing user addresses.
 * Integrates React Hook Form, Zod validation, and shadcn/ui components.
 */
const AddressForm: React.FC<AddressFormProps> = ({
  onSubmit,
  initialData,
  isLoading = false,
  submitButtonText = "Save Address",
}) => {
  const form = useForm<AddressInputSchema>({
    resolver: zodResolver(AddressSchema),
    defaultValues: initialData || {
      first_name: "",
      last_name: "",
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      country_code: "",
      province: "",
      phone: "",
      company: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="first_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="John"
                    {...field}
                    aria-required="true"
                    aria-describedby="addr-first-name-error"
                    aria-invalid={!!form.formState.errors.first_name}
                  />
                </FormControl>
                <FormMessage id="addr-first-name-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="last_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Doe"
                    {...field}
                    aria-required="true"
                    aria-describedby="addr-last-name-error"
                    aria-invalid={!!form.formState.errors.last_name}
                  />
                </FormControl>
                <FormMessage id="addr-last-name-error" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Acme Inc."
                  {...field}
                  value={field.value ?? ""}
                  aria-describedby="addr-company-error"
                  aria-invalid={!!form.formState.errors.company}
                />
              </FormControl>
              <FormMessage id="addr-company-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 1</FormLabel>
              <FormControl>
                <Input
                  placeholder="123 Main St"
                  {...field}
                  aria-required="true"
                  aria-describedby="addr-line1-error"
                  aria-invalid={!!form.formState.errors.address_1}
                />
              </FormControl>
              <FormMessage id="addr-line1-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address Line 2 (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Apt 4B"
                  {...field}
                  value={field.value ?? ""}
                  aria-describedby="addr-line2-error"
                  aria-invalid={!!form.formState.errors.address_2}
                />
              </FormControl>
              <FormMessage id="addr-line2-error" />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Anytown"
                    {...field}
                    aria-required="true"
                    aria-describedby="addr-city-error"
                    aria-invalid={!!form.formState.errors.city}
                  />
                </FormControl>
                <FormMessage id="addr-city-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Province/State (Optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="CA"
                    {...field}
                    value={field.value ?? ""}
                    aria-describedby="addr-province-error"
                    aria-invalid={!!form.formState.errors.province}
                  />
                </FormControl>
                <FormMessage id="addr-province-error" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="postal_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input
                    placeholder="90210"
                    {...field}
                    aria-required="true"
                    aria-describedby="addr-postal-code-error"
                    aria-invalid={!!form.formState.errors.postal_code}
                  />
                </FormControl>
                <FormMessage id="addr-postal-code-error" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="country_code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country Code (2 Letters)</FormLabel>
              <FormControl>
                <Input
                  placeholder="US"
                  {...field}
                  maxLength={2}
                  className="uppercase"
                  aria-required="true"
                  aria-describedby="addr-country-code-error"
                  aria-invalid={!!form.formState.errors.country_code}
                />
              </FormControl>
              <FormMessage id="addr-country-code-error" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="123-456-7890"
                  {...field}
                  value={field.value ?? ""}
                  aria-describedby="addr-phone-error"
                  aria-invalid={!!form.formState.errors.phone}
                />
              </FormControl>
              <FormMessage id="addr-phone-error" />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Processing...
            </>
          ) : (
            submitButtonText
          )}
        </Button>
        {form.formState.errors.root?.serverError && (
          <div
            className="text-sm font-medium text-destructive pt-2"
            role="alert"
          >
            {form.formState.errors.root.serverError.message}
          </div>
        )}
      </form>
    </Form>
  );
};

export default AddressForm;
/* END OF FILE frontend/components/user/AddressForm.tsx */
