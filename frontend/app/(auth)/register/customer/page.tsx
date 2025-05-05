// File: frontend/app/(auth)/register/customer/page.tsx
// Task IDs: FE-017, FE-043, FE-046, FE-049, FE-056
// Description: Revised Customer Registration page integrating RHF/Zod via component,
//              API submission via hook, loading/error handling.
// Status: Revised based on Recommendations A.1, A.2, A.3, A.4, A.6. Requires CustomerRegisterForm, useRegisterCustomerMutation, and related types/schemas.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import CustomerRegisterForm from "@/components/auth/CustomerRegisterForm"; // Assumed component
import { useRegisterCustomerMutation } from "@/hooks/mutations/useAuthMutations"; // Assumed hook
import { CustomerRegisterSchema } from "@/lib/zodSchemas"; // Assumed schema
import type { CustomerRegisterUserInput } from "@/lib/types/auth";

/**
 * Customer Registration Page Component.
 * Orchestrates the customer registration form, validation, and submission.
 */
export default function CustomerRegisterPage() {
  const router = useRouter();
  const { mutate: registerCustomer, isPending } = useRegisterCustomerMutation(); // Get mutation state

  const form = useForm<CustomerRegisterUserInput>({
    resolver: zodResolver(CustomerRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const { setError } = form;

  const handleRegister = (data: CustomerRegisterUserInput) => {
    // Exclude confirmPassword before sending to backend
    const { confirmPassword, ...submitData } = data;
    console.log("Customer registration attempt with:", submitData); // Dev log

    registerCustomer(submitData, {
      onSuccess: () => {
        toast({
          title: "Registration Successful",
          description: "Please log in with your new account.",
        });
        router.push("/login");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.structuredError?.message ||
          "Registration failed. Please try again.";
        toast({
          title: "Registration Failed",
          description: errorMessage,
          variant: "destructive",
        });

        // Example: Set form error if email exists (based on common BE response)
        if (
          error?.response?.data?.error?.code === "EMAIL_ALREADY_EXISTS" ||
          error?.response?.status === 409
        ) {
          setError("email", {
            type: "server",
            message: "An account with this email already exists.",
          });
        } else {
          // Set a generic error on the root if no specific field known
          // setError('root.serverError', { type: 'server', message: errorMessage });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Create Customer Account
      </h1>
      <CustomerRegisterForm
        onSubmit={handleRegister}
        isPending={isPending}
        formInstance={form} // Pass form instance for potential server errors
      />
      <div className="text-sm text-center text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="underline text-primary hover:text-primary/80"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
