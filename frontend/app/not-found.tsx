// File: frontend/app/not-found.tsx
// Task IDs: FE-053 (US-FE-025 - Root Not Found Page)
// Description: Root 'Not Found' page for the application using Next.js App Router convention. Handles invalid routes, displaying a user-friendly message and navigation options.
// Status: Revised - No code changes from previous version based on analysis.

import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Custom Not Found page component, rendered automatically by Next.js for unmatched routes.
 */
export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4"
      data-testid="not-found-page"
    >
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Page Not Found
      </h2>
      <p className="text-muted-foreground mb-8 max-w-sm">
        Oops! The page you are looking for does not exist. It might have been
        moved or deleted.
      </p>
      <Button asChild>
        <Link href="/" data-testid="not-found-gohome-button">
          Go back to Homepage
        </Link>
      </Button>
    </div>
  );
}
