// --- START OF FILE frontend/app/(auth)/login/page.tsx ---
// Revision incorporates Recommendations A.2, A.3, A.4, B.1

"use client"; // Required for client-side hooks and event handling

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// NOTE: Assuming specific Zod schema defined in lib/zodSchemas.ts (as per FE-BL-003/US-FE-011)
// import { loginSchema } from '@/lib/zodSchemas'; // Needs verification
// NOTE: Assuming mutation hook defined in hooks/mutations/ (as per FE-BL-006/US-FE-018 pattern)
// import { useLoginMutation } from '@/hooks/mutations/useLoginMutation'; // Needs verification
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
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(1, { message: "Password is required." }), // Min length validation is usually here, but example focuses on presence
});
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Renders the Login page with form handling and validation.
 * Tasks: FE-017, FE-042, FE-045, FE-049, FE-055
 */
export default function LoginPage() {
  // NOTE: Placeholder for actual login mutation hook (replace with import and usage)
  const {
    mutate: loginUser,
    isPending,
    error: mutationError,
  } = {
    mutate: (data: any) => console.log("Simulating Login:", data),
    isPending: false,
    error: null,
  }; // useLoginMutation();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = form;

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login form submitted:", data);
    // In a real implementation, call the mutation hook
    // loginUser(data, {
    //   onSuccess: () => {
    //     // Handle successful login (e.g., redirect)
    //     console.log("Login successful");
    //     // NextAuth typically handles redirect via callbackUrl
    //   },
    //   onError: (error: any) => {
    //     // Handle server-side errors (e.g., invalid credentials, vendor status)
    //     console.error("Login failed:", error);
    //     // Display generic or specific error message based on API response
    //     // Use RHF setError to display field-specific errors if backend provides them
    //     setError("root.serverError", { // Use "root" for general form errors
    //       type: "manual",
    //       message: error.response?.data?.message || "Login failed. Please check your credentials.",
    //     });
    //   }
    // });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl">Login</CardTitle>
        <CardDescription>
          Enter your email and password below to log in.
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
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
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
              autoComplete="current-password"
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
          {/* Placeholder for Forgot Password Link (Recommendation B.1) */}
          <div className="text-sm text-right">
            <Link
              href="/forgot-password" // Placeholder path
              className="underline hover:text-primary text-muted-foreground text-xs"
            >
              Forgot Password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Spinner className="mr-2 h-4 w-4" />}
            Login
          </Button>
          {/* Placeholder for OAuth Login Button */}
          {/* <Button variant="outline" className="w-full" type="button" disabled={isPending}>Login with Google</Button> */}
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2 text-sm">
        {/* Links for Registration (Recommendation B.1) */}
        <div className="text-muted-foreground">Don't have an account?</div>
        <div className="flex space-x-2">
          <Link
            href="/register/customer"
            className="underline hover:text-primary"
          >
            Register as Customer
          </Link>
          <span>or</span>
          <Link
            href="/register/vendor"
            className="underline hover:text-primary"
          >
            Register as Vendor
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
// --- END OF FILE frontend/app/(auth)/login/page.tsx ---
