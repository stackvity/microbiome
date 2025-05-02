// File: frontend/components/providers/ReactQueryProvider.tsx
// --- START OF FILE ---

"use client"; // Required for context providers

import React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import getQueryClient from "@/lib/react-query/client"; // Path verified

/**
 * Provides the React Query client context to the application component tree.
 * Includes React Query Devtools for development environments.
 * Rationale (FE-014): Enables React Query hooks throughout the application.
 */
export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode; // Standard type, sufficient per Rec B.2
}) {
  // Creates a new QueryClient instance per client-side session via useState,
  // using the cached singleton instance from getQueryClient on initial render.
  const [queryClient] = React.useState(() => getQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Conditionally render Devtools only in development */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

// --- END OF FILE ---
