/* START OF FILE frontend/components/auth/LoginForm.tsx */
// File: frontend/components/auth/LoginForm.tsx
// Task IDs: Implied by FE-042, FE-045, FE-049, FE-055
// Description: Component rendering the login form, integrating RHF/Zod.
// Status: Revised - Corrected Input import casing and LoginUserInput import path.

"use client";

import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
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
import { LoginSchema } from "@/lib/zodSchemas";
import type { LoginUserInput } from "@/lib/zodSchemas"; // CORRECTED IMPORT PATH
import { Spinner } from "@/components/ui/spinner";

interface LoginFormProps {
  onSubmit: (data: LoginUserInput) => void;
  isPending?: boolean;
  formInstance?: UseFormReturn<LoginUserInput>;
}

/**
 * Displays the login form with email and password fields.
 * Integrates React Hook Form, Zod validation, and shadcn/ui components.
 * Accepts an optional formInstance prop for external control.
 */
const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isPending = false,
  formInstance,
}) => {
  const internalForm = useForm<LoginUserInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const form = formInstance || internalForm;

  const handleFormSubmit = (data: LoginUserInput) => {
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
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="name@example.com"
                  {...field}
                  data-testid="email-input"
                  aria-required="true"
                  aria-describedby="email-error" // Links input to message
                  aria-invalid={!!form.formState.errors.email} // Indicates invalid state
                />
              </FormControl>
              <FormMessage id="email-error" /> {/* Provides the message */}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  data-testid="password-input"
                  aria-required="true"
                  aria-describedby="password-error" // Links input to message
                  aria-invalid={!!form.formState.errors.password} // Indicates invalid state
                />
              </FormControl>
              <FormMessage id="password-error" /> {/* Provides the message */}
            </FormItem>
          )}
        />

        {/* Display general server errors if passed via setError('root.serverError', {...}) */}
        {form.formState.errors.root?.serverError && (
          <div className="text-sm font-medium text-destructive" role="alert">
            {form.formState.errors.root.serverError.message}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
          data-testid="login-button"
        >
          {isPending ? (
            <>
              <Spinner className="mr-2 h-4 w-4" /> Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
/* END OF FILE frontend/components/auth/LoginForm.tsx */
