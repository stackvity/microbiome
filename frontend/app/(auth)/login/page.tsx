// File: frontend/app/(auth)/login/page.tsx
// Task IDs: FE-017, FE-042, FE-045, FE-049, FE-055
// Description: Revised Login page component integrating RHF/Zod via LoginForm, API submission via useLoginMutation,
//              and handling loading/error states using Sonner for toasts.
// Status: Revised - Replaced deprecated useToast with Sonner toast functions. Corrected type import path.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form"; // RHF usage is encapsulated in LoginForm, but needed here for setError
import { zodResolver } from "@hookform/resolvers/zod"; // Needed for type safety potentially, though resolver used in child
// import { toast } from "@/components/ui/use-toast"; // REMOVE deprecated import
import { toast } from "sonner"; // IMPORT Sonner toast function directly
import LoginForm from "@/components/auth/LoginForm"; // Assumed component handling RHF/Zod/UI
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations"; // Assumed hook for API call
import { LoginSchema } from "@/lib/zodSchemas"; // Assumed schema exists
import type { LoginUserInput } from "@/lib/zodSchemas"; // CORRECTED Import Path

/**
 * Login Page Component.
 * Orchestrates login form submission, using LoginForm for UI/validation
 * and useLoginMutation for API interaction. Handles redirect and error feedback using Sonner.
 */
export default function LoginPage() {
  const router = useRouter();
  // NOTE: Assume useLoginMutation hook *does not* internally call the old use-toast
  // and that error/success feedback should be handled here or passed via callbacks.
  const { mutate: loginUser, isPending } = useLoginMutation(); // Get mutation function and pending state

  const form = useForm<LoginUserInput>({
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
        // Use Sonner's success style
        toast.success("Login Successful", {
          description: "Redirecting...",
        });
        router.push("/account/dashboard");
        // Potentially add router.refresh() if session update needs manual trigger
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.structuredError?.message ||
          "Login failed. Please check your credentials or try again later.";

        const fieldErrors = error?.response?.data?.error?.details;
        let displayedFieldErrors = false;

        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach(
            (fieldError: { field: keyof LoginUserInput; message: string }) => {
              if (
                fieldError.field &&
                (fieldError.field === "email" ||
                  fieldError.field === "password")
              ) {
                setError(fieldError.field, {
                  type: "server",
                  message: fieldError.message,
                });
                displayedFieldErrors = true; // Mark that we handled a specific field error
              }
            }
          );
        }

        // Only show a generic error toast if no specific field error was set by RHF's setError
        // or if it's a generic 401/403/5xx without details
        if (!displayedFieldErrors) {
          // Use Sonner's error style
          toast.error("Login Failed", {
            description: errorMessage,
          });
          // Optionally set a generic error on a root form element if LoginForm supports it
          // setError('root.serverError', { type: 'server', message: errorMessage });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-center">Login</h1>
      <LoginForm
        onSubmit={handleLogin}
        isPending={isPending}
        formInstance={form}
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
