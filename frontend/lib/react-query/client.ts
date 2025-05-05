// File: frontend/lib/react-query/client.ts
// Task ID: FE-014
// Description: Creates and exports the shared TanStack Query (React Query) client instance.
// Status: Revised (Applying B.3 - Uncommented and set initial cache times).

import { QueryClient } from "@tanstack/react-query";

// Default configuration options for the QueryClient
const queryClientOptions = {
  defaultOptions: {
    queries: {
      // How long data is considered fresh before becoming stale (5 minutes)
      staleTime: 1000 * 60 * 5,
      // How long inactive query data remains in cache before garbage collection (10 minutes)
      gcTime: 1000 * 60 * 10,
      // Default retry attempts for failed queries
      retry: 1,
      // Disable refetching on window focus by default to avoid potentially unnecessary requests
      refetchOnWindowFocus: false,
    },
    mutations: {
      // Default retry attempts for failed mutations
      retry: 0,
    },
  },
};

/**
 * Shared TanStack Query (React Query) client instance.
 * Configured with default options for caching, retries, etc.
 */
const queryClient = new QueryClient(queryClientOptions);

export default queryClient;
