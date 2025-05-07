// File: frontend/hooks/mutations/useAuthMutations.ts
// Task IDs: Implied by FE-049, FE-055, FE-056
// Description: Provides React Query mutation hooks for authentication-related actions (Login, Registration).

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
// Import relevant types from the correct location (zodSchemas where input types are inferred)
import type {
  LoginUserInput,
  CustomerRegisterUserInput,
  VendorRegisterUserInput,
} from "@/lib/zodSchemas"; // CORRECTED Import Path
import type { User } from "@/types/user"; // Assuming User type exists
import type { AxiosError } from "axios";

// --- Login Mutation ---

// Define response type for login (adjust based on actual API response)
interface LoginResponse {
  // Assuming Medusa returns the customer object upon successful login
  customer: User;
}

// Async function for login API call
const loginUser = async (
  credentials: LoginUserInput
): Promise<LoginResponse> => {
  // Endpoint assumed based on AUT-API-002.md and common Medusa patterns
  // Note: Verify actual endpoint and response structure.
  const response = await api.post<LoginResponse>("/store/auth", credentials);
  return response.data;
};

/**
 * React Query mutation hook for user login.
 */
export const useLoginMutation = (): UseMutationResult<
  LoginResponse,
  AxiosError, // Use AxiosError for better error handling
  LoginUserInput
> => {
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, AxiosError, LoginUserInput>({
    mutationFn: loginUser,
    onSuccess: (data) => {
      // On successful login, invalidate queries that depend on auth state
      // e.g., invalidate user profile, potentially cart if it merges
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] }); // Example if cart needs refetch
      console.log("Login successful, user:", data.customer);
      // Success feedback (toast) should ideally be handled in the component calling mutate
    },
    onError: (error) => {
      // Error logging/handling can happen here, but specific UI feedback (toast/form errors)
      // is better handled in the component's onError callback.
      console.error(
        "Login mutation failed:",
        error.response?.data || error.message
      );
    },
  });
};

// --- Customer Registration Mutation ---

// Define response type (adjust based on actual API)
// Medusa might return the created customer or just a success status
interface RegisterCustomerResponse {
  customer: User;
}

// Async function
const registerCustomer = async (
  data: Omit<CustomerRegisterUserInput, "confirmPassword">
): Promise<RegisterCustomerResponse> => {
  // Endpoint assumed based on REG-API-003.md and Medusa patterns
  const response = await api.post<RegisterCustomerResponse>(
    "/store/customers",
    data
  );
  return response.data;
};

/**
 * React Query mutation hook for customer registration.
 */
export const useRegisterCustomerMutation = (): UseMutationResult<
  RegisterCustomerResponse,
  AxiosError,
  Omit<CustomerRegisterUserInput, "confirmPassword">
> => {
  return useMutation<
    RegisterCustomerResponse,
    AxiosError,
    Omit<CustomerRegisterUserInput, "confirmPassword">
  >({
    mutationFn: registerCustomer,
    onSuccess: () => {
      // Maybe invalidate something? Often just redirecting handled in component.
      console.log("Customer registration successful");
    },
    onError: (error) => {
      console.error(
        "Customer registration mutation failed:",
        error.response?.data || error.message
      );
    },
  });
};

// --- Vendor Registration Mutation ---

// Define response type (adjust based on actual API)
// Might return the pending user record or just success status
interface RegisterVendorResponse {
  customer: User; // Assuming similar structure initially, but with role/status set
}

// Async function
const registerVendor = async (
  data: VendorRegisterUserInput
): Promise<RegisterVendorResponse> => {
  // Endpoint assumed based on REG-API-003.md (might be /store/vendors or similar custom endpoint)
  const response = await api.post<RegisterVendorResponse>(
    "/store/vendors",
    data
  ); // VERIFY Endpoint
  return response.data;
};

/**
 * React Query mutation hook for vendor registration/application.
 */
export const useRegisterVendorMutation = (): UseMutationResult<
  RegisterVendorResponse,
  AxiosError,
  VendorRegisterUserInput
> => {
  return useMutation<
    RegisterVendorResponse,
    AxiosError,
    VendorRegisterUserInput
  >({
    mutationFn: registerVendor,
    onSuccess: () => {
      console.log("Vendor application submitted successfully");
    },
    onError: (error) => {
      console.error(
        "Vendor registration mutation failed:",
        error.response?.data || error.message
      );
    },
  });
};

// Add other auth-related mutations here (e.g., logout, password reset request/confirm) as needed
