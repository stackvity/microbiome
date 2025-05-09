/* START OF FILE frontend/app/(auth)/register/customer/page.tsx */
// File: frontend/app/(auth)/register/customer/page.tsx
// Task IDs: FE-017, FE-043, FE-046, FE-049, FE-056
// Description: Revised Customer Registration page integrating RHF/Zod via component,
//              API submission via hook, loading/error handling using Sonner for toasts.
// Status: Corrected - Fixed import paths for toast, component, and types based on analysis. Uses generic RegisterForm.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast"; // REMOVED - Incorrect path and library
import { toast } from "sonner"; // CORRECTED - Use Sonner for toasts
// import CustomerRegisterForm from "@/components/auth/CustomerRegisterForm"; // REMOVED - Use generic RegisterForm
import RegisterForm from "@/components/auth/RegisterForm"; // CORRECTED - Import generic RegisterForm
import { useRegisterCustomerMutation } from "@/hooks/mutations/useAuthMutations"; // Assumed hook exists
import { CustomerRegisterSchema } from "@/lib/zodSchemas"; // Assumed schema exists
// import type { CustomerRegisterUserInput } from "@/lib/types/auth"; // REMOVED - Incorrect path
import type { CustomerRegisterUserInput } from "@/lib/zodSchemas"; // CORRECTED - Type derived from Zod schema

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
        // Use Sonner success toast
        toast.success("Registration Successful", {
          description: "Please log in with your new account.",
        });
        router.push("/login");
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.structuredError?.message ||
          "Registration failed. Please try again.";

        // Use Sonner error toast
        toast.error("Registration Failed", {
          description: errorMessage,
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
          // This requires the RegisterForm to handle root.serverError
          setError("root.serverError", {
            type: "server",
            message: errorMessage,
          });
        }
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-2xl font-semibold text-center">
        Create Customer Account
      </h1>
      {/* Use the generic RegisterForm with appropriate type */}
      <RegisterForm<CustomerRegisterUserInput>
        formType="customer"
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
/* END OF FILE frontend/app/(auth)/register/customer/page.tsx */
