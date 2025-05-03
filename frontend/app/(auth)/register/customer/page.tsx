// --- START OF FILE frontend/app/(auth)/register/customer/page.tsx ---
// Revision incorporates Recommendations A.2, A.3, A.4, B.1

"use client"; // Required for client-side hooks and event handling

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// NOTE: Assuming specific Zod schema defined in lib/zodSchemas.ts (as per FE-BL-003/US-FE-011)
// import { customerRegisterSchema } from '@/lib/zodSchemas'; // Needs verification
// NOTE: Assuming mutation hook defined in hooks/mutations/ (as per FE-BL-006/US-FE-018 pattern)
// import { useRegisterCustomerMutation } from '@/hooks/mutations/useRegisterCustomerMutation'; // Needs verification
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

// Define Zod schema locally for demonstration if import not available
// Replace with actual import from lib/zodSchemas.ts
const customerRegisterSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required." }),
    lastName: z.string().min(1, { message: "Last name is required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
  })
  // Add refinement for password matching
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"], // Path of error
  });

type CustomerRegisterFormValues = z.infer<typeof customerRegisterSchema>;

/**
 * Renders the Customer Registration page with form handling and validation.
 * Tasks: FE-017, FE-043, FE-046, FE-049, FE-056
 */
export default function CustomerRegistrationPage() {
  // NOTE: Placeholder for actual registration mutation hook
  const {
    mutate: registerCustomer,
    isPending,
    error: mutationError,
  } = {
    mutate: (data: any) => console.log("Simulating Customer Register:", data),
    isPending: false,
    error: null,
  }; // useRegisterCustomerMutation();

  const form = useForm<CustomerRegisterFormValues>({
    resolver: zodResolver(customerRegisterSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  const onSubmit = async (data: CustomerRegisterFormValues) => {
    console.log("Customer registration form submitted:", data);
    // Destructure to exclude confirmPassword before sending to backend
    const { confirmPassword, ...submitData } = data;

    // In a real implementation, call the mutation hook
    // registerCustomer(submitData, {
    //   onSuccess: () => {
    //     // Handle successful registration (e.g., redirect to login or show success message)
    //     console.log("Customer registration successful");
    //     // Typically redirect to login page with a success message
    //     // router.push('/login?registered=true'); // Example using next/navigation
    //   },
    //   onError: (error: any) => {
    //     // Handle server-side errors (e.g., email already exists)
    //     console.error("Customer registration failed:", error);
    //     setError("root.serverError", {
    //       type: "manual",
    //       message: error.response?.data?.message || "Registration failed. Please try again.",
    //     });
    //   }
    // });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Create Customer Account</CardTitle>
        <CardDescription>Enter your details below to register.</CardDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Max"
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
                placeholder="Robinson"
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
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            Create Account
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
// --- END OF FILE frontend/app/(auth)/register/customer/page.tsx ---
