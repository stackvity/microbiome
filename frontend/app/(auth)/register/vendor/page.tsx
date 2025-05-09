/* START OF FILE frontend/app/(auth)/register/vendor/page.tsx */
// File: frontend/app/(auth)/register/vendor/page.tsx
// Task IDs: FE-017, FE-044, FE-047, FE-049, FE-056
// Description: Revised Vendor Registration page integrating RHF/Zod via component,
//              API submission via hook, loading/error handling using Sonner toasts.
// Status: Corrected - Fixed import paths for toast, component, and types based on analysis. Uses generic RegisterForm.

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
// import { toast } from "@/components/ui/use-toast"; // REMOVED - Incorrect path and library
import { toast } from "sonner"; // CORRECTED - Use Sonner for toasts
// import VendorRegisterForm from "@/components/auth/VendorRegisterForm"; // REMOVED - Use generic RegisterForm
import RegisterForm from "@/components/auth/RegisterForm"; // CORRECTED - Import generic RegisterForm
import { useRegisterVendorMutation } from "@/hooks/mutations/useAuthMutations"; // Assumed hook exists
import { VendorRegisterSchema } from "@/lib/zodSchemas"; // Assumed schema exists
// import type { VendorRegisterUserInput } from "@/lib/types/auth"; // REMOVED - Incorrect path
import type { VendorRegisterUserInput } from "@/lib/zodSchemas"; // CORRECTED - Type derived from Zod schema

/**
 * Vendor Registration Page Component.
 * Orchestrates the vendor application form, validation, and submission.
 */
export default function VendorRegisterPage() {
  const router = useRouter();
  const { mutate: registerVendor, isPending } = useRegisterVendorMutation(); // Get mutation state

  const form = useForm<VendorRegisterUserInput>({
    resolver: zodResolver(VendorRegisterSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirmPassword: "",
      business_name: "",
      // Add other vendor specific fields with default values
      business_address_1: "",
      business_city: "",
      business_postal_code: "",
      business_country_code: "", // Maybe default to 'US'?
      business_province: "",
      business_website: "",
      tax_id: "",
      phone: "",
    },
  });
  const { setError } = form;

  const handleRegister = (data: VendorRegisterUserInput) => {
    // Exclude confirmPassword before sending to backend
    const { confirmPassword, ...submitData } = data;
    console.log("Vendor registration attempt with:", submitData); // Dev log

    registerVendor(submitData, {
      onSuccess: () => {
        // Use Sonner success toast
        toast.success("Application Submitted", {
          description:
            "Your vendor application has been received and is under review. You will be notified via email.",
        });
        // Redirect to a confirmation/pending page
        router.push("/application-pending"); // Example route
      },
      onError: (error: any) => {
        const errorMessage =
          error?.response?.data?.error?.message ||
          error?.structuredError?.message ||
          "Application submission failed. Please try again.";

        // Use Sonner error toast
        toast.error("Application Failed", {
          description: errorMessage,
        });

        // Example: Set form error if email exists
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
    <div className="w-full max-w-lg space-y-6">
      <h1 className="text-2xl font-semibold text-center">Become a Vendor</h1>
      <p className="text-center text-muted-foreground">
        Submit your application to sell on the Biomevity Marketplace.
        Applications are manually reviewed.
      </p>
      {/* Use the generic RegisterForm with appropriate type */}
      <RegisterForm<VendorRegisterUserInput>
        formType="vendor"
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
/* END OF FILE frontend/app/(auth)/register/vendor/page.tsx */
