// File: frontend/lib/react-query/ReactQueryProvider.tsx
// Task ID: FE-014
// Description: Provides the TanStack Query (React Query) client to the application component tree. Includes React Query DevTools for development.
// Status: No changes required based on analysis/recommendations.

"use client"; // This directive is necessary for components using hooks like useState or accessing browser APIs

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React, { useState } from "react";
import queryClient from "./client"; // Import the shared client instance

/**
 * Wraps the application with QueryClientProvider to make React Query available.
 * Conditionally renders React Query Devtools in development environments.
 * @param {React.PropsWithChildren} props - Component props including children.
 */
function ReactQueryProvider({ children }: React.PropsWithChildren) {
  // Ensure QueryClient is only created once per application lifecycle using useState
  // This is the recommended approach in React Query docs for client components
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      {/* Conditionally render DevTools only in non-production environments */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
