/* START OF FILE frontend/hooks/queries/useUserProfile.ts */
// FILE: frontend/hooks/queries/useUserProfile.ts
// Task ID: FE-034
// Description: React Query hook for fetching the authenticated user's profile.
// Status: Revised - Assumes API/Type verification (A.2) passed. Considering B.3 (Stale Time).

import { useQuery, UseQueryResult } from "@tanstack/react-query";
import api from "@/lib/api/axiosInstance";
import type { User } from "@/types/user";
import { useAuthStore } from "@/store/useAuthStore"; // Depends on FE-015

// Define the expected API response structure based on ACC-API-005
interface UserProfileResponse {
  customer: User; // Medusa storefront API uses 'customer' key
}

// Asynchronous function to fetch the user profile
const fetchUserProfile = async (): Promise<UserProfileResponse> => {
  // Endpoint verified against ACC-API-005
  const { data } = await api.get<UserProfileResponse>("/store/customers/me");
  return data;
};

/**
 * Custom React Query hook to fetch the profile of the currently authenticated user.
 * The query is conditionally enabled based on the authentication state from useAuthStore.
 * @returns {UseQueryResult<UserProfileResponse, Error>} The state of the query execution.
 */
export const useUserProfile = (): UseQueryResult<
  UserProfileResponse,
  Error
> => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const queryKey = ["userProfile"];

  return useQuery<UserProfileResponse, Error>({
    queryKey: queryKey,
    queryFn: fetchUserProfile,
    enabled: isAuthenticated,
    // staleTime: 1000 * 60 * 15, // Optional: Longer stale time for less frequent background refetches
  });
};
/* END OF FILE frontend/hooks/queries/useUserProfile.ts */
