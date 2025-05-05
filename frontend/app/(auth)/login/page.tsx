// File: frontend/app/(auth)/login/page.tsx
// Task IDs: FE-017, FE-042, FE-045, FE-049, FE-055
// Description: Revised Login page component integrating RHF/Zod via LoginForm, API submission via useLoginMutation,
//              and handling loading/error states.
// Status: Revised based on Recommendations A.1, A.2, A.3, A.4, A.6. Requires LoginForm, useLoginMutation, and related types/schemas.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form"; // RHF usage is encapsulated in LoginForm, but needed here for setError
import { zodResolver } from "@hookform/resolvers/zod"; // Needed for type safety potentially, though resolver used in child
import { toast } from "@/components/ui/use-toast";
import LoginForm from "@/components/auth/LoginForm"; // Assumed component handling RHF/Zod/UI
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations"; // Assumed hook for API call
import { LoginSchema } from "@/lib/zodSchemas"; // Assumed schema exists
import type { LoginUserInput } from "@/lib/types/auth";

/**
 * Login Page Component.
 * Orchestrates login form submission, using LoginForm for UI/validation
 * and useLoginMutation for API interaction. Handles redirect and error feedback.
 */
export default function LoginPage() {
  const router = useRouter();
  const { mutate: loginUser, isPending } = useLoginMutation(); // Get mutation function and pending state

  // Need form instance to potentially set server errors back onto fields
  const form = useForm<LoginUserInput>({
    // Resolver likely set within LoginForm, but referencing schema here for safety/type
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { setError } = form; // Destructure setError for use in onError callback

  const handleLogin = (data: LoginUserInput) => {
    loginUser(data, {
      onSuccess: (/*responseData*/) => {
        // Type responseData based on actual API return if needed
        toast({ title: "Login Successful", description: "Redirecting..." });
        // Example: Redirect to customer dashboard. More sophisticated routing based
        // on user role might happen in a central listener or via middleware.
        // NextAuth callbackUrl might also handle redirection automatically.
        router.push("/account/dashboard");
        // router.refresh(); // May not be needed if NextAuth handles session update redirects well
      },
      onError: (error: any) => {
        // Attempt to extract backend error message for user feedback
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.structuredError?.message || // From custom axios interceptor if implemented
          "Login failed. Please check your credentials or try again later.";

        // Attempt to set specific field errors if backend provides them
        // This depends on the backend error structure and LoginForm accepting 'setError'
        const fieldErrors = error?.response?.data?.error?.details; // Example structure
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(
            (fieldError: { field: keyof LoginUserInput; message: string }) => {
              // Ensure field exists on the form before setting error
              if (
                fieldError.field &&
                (fieldError.field === "email" ||
                  fieldError.field === "password")
              ) {
                setError(fieldError.field, {
                  type: "server",
                  message: fieldError.message,
                });
              }
            }
          );
          // Show a general toast only if no field-specific errors were set
          if (
            !fieldErrors.some(
              (fe) => fe.field === "email" || fe.field === "password"
            )
          ) {
            toast({
              title: "Login Failed",
              description: errorMessage,
              variant: "destructive",
            });
          }
        } else if (
          error?.response?.status === 401 ||
          error?.response?.status === 403
        ) {
          // Generic credentials or status error if no field detail provided
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
          // Optionally set a generic error on a root form element if available
          // setError('root.serverError', { type: 'server', message: errorMessage });
        } else {
          // Rely on global interceptor for 5xx, but show a toast here too as fallback
          toast({
            title: "Login Failed",
            description: errorMessage,
            variant: "destructive",
          });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-center">Login</h1>
      <LoginForm
        onSubmit={handleLogin}
        isPending={isPending} // Pass loading state to disable button
        formInstance={form} // Pass the form instance for potential server error setting
      />
      <div className="text-sm text-center text-muted-foreground">
        Don't have an account?{" "}
        <Link
          href="/register/customer"
          className="underline text-primary hover:text-primary/80"
        >
          Register as Customer
        </Link>
        {" / "}
        <Link
          href="/register/vendor"
          className="underline text-primary hover:text-primary/80"
        >
          Register as Vendor
        </Link>
      </div>
      {/* TODO: Add Forgot Password Link */}
      <div className="text-sm text-center text-muted-foreground">
        <Link
          href="/forgot-password"
          className="underline text-primary hover:text-primary/80"
        >
          Forgot Password?
        </Link>
      </div>
    </div>
  );
}
