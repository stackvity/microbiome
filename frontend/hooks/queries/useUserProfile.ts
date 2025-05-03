// File: frontend/hooks/queries/useUserProfile.ts
// --- START OF FILE ---

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance"; // Path verified
import type { User } from "@/types"; // Path verified
import useAuthStore from "@/store/useAuthStore"; // Path verified

/**
 * Aligns with Medusa's `GET /store/customers/me` response structure.
 */
interface CustomerProfileResponse {
  customer: User;
  // Additional related data might be included by Medusa, adapt type as needed.
}

/**
 * Fetches the profile information for the currently authenticated customer.
 * Corresponds to `GET /store/customers/me`.
 * Requires authentication (handled by axios instance).
 */
const fetchUserProfile = async (): Promise<CustomerProfileResponse> => {
  const response = await api.get<CustomerProfileResponse>(
    "/store/customers/me"
  );
  return response.data;
};

/**
 * React Query hook for fetching the profile of the currently authenticated user.
 * Automatically enabled/disabled based on authentication state from Zustand store.
 * Rationale (Task ID FE-034)
 */
export const useUserProfile = (
  options?: object
): UseQueryResult<CustomerProfileResponse, Error> => {
  // Link query's enabled state to the Zustand authentication state
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery<CustomerProfileResponse, Error>({
    // Unique query key for user profile data
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
    // Only enable the query if the user is authenticated
    enabled: isAuthenticated,
    ...options,
  });
};

// --- END OF FILE ---
