/* START OF FILE frontend/app/error.tsx */
// File: frontend/app/error.tsx
// Task IDs: FE-052 (US-FE-025 - Root Error Boundary)
// Status: Corrected - Fixed import path casing for Button component.

"use client"; // Error components must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/Button"; // CORRECTED: Path uses PascalCase 'Button'
import Link from "next/link";

/**
 * Root error boundary component. Catches rendering errors, logs them, and provides recovery options.
 * @param {Error & { digest?: string }} error - The caught error object.
 * @param {() => void} reset - Function to attempt re-rendering the segment.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to Sentry. Ensure DSN is configured.
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex items-center justify-center min-h-screen bg-background text-foreground">
        <div className="text-center p-8 border rounded-lg shadow-md max-w-md mx-auto bg-card">
          <h2 className="text-2xl font-semibold text-destructive mb-4">
            Something went wrong!
          </h2>
          <p className="text-muted-foreground mb-6">
            An unexpected error occurred. Our team has been notified. Please try
            again or contact support if the problem persists.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              onClick={
                // Attempt to recover by trying to re-render the segment
                () => reset()
              }
              variant="default"
              data-testid="error-reset-button"
            >
              Try again
            </Button>
            <Button variant="outline" asChild>
              <Link href="/" data-testid="error-gohome-button">
                Go Home
              </Link>
            </Button>
          </div>
          {/* Display error details only in development environments */}
          {process.env.NODE_ENV === "development" && (
            <details className="mt-6 text-left text-xs text-muted-foreground bg-muted p-2 rounded">
              <summary>Error Details (Development Only)</summary>
              <pre className="mt-2 whitespace-pre-wrap break-words">
                <code>
                  {error?.message}\n{error?.stack}
                </code>
              </pre>
            </details>
          )}
        </div>
      </body>
    </html>
  );
}
/* END OF FILE frontend/app/error.tsx */
