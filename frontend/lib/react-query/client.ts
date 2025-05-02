// File: frontend/lib/react-query/client.ts
// --- START OF FILE ---

import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

/**
 * Creates and returns a singleton QueryClient instance per request scope on the server,
 * leveraging React's `cache` function.
 * Rationale (FE-014): Centralizes client creation for React Query Provider.
 */
const getQueryClient = cache(
  () =>
    new QueryClient({
      /*
  // Optional B.1: Consider adding default options globally as needed later.
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Example: 5 minutes
      // refetchOnWindowFocus: false,
    },
  },
  */
    })
);

export default getQueryClient;

// --- END OF FILE ---
