// frontend/app/error.tsx
"use client"; // Error components must be Client Components

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

/**
 * Root error boundary for the Next.js App Router.
 * Catches unhandled errors during rendering and provides a fallback UI.
 * Logs errors to Sentry.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
    console.error("Unhandled Application Error:", error); // Keep for dev visibility
  }, [error]);

  return (
    <html lang="en">
      <body>
        {/* Verification A.5: Ensures consistent layout use by rendering within html/body like root layout */}
        <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-background p-4 text-center">
          <AlertTriangle
            className="h-16 w-16 text-destructive"
            strokeWidth={1.5}
          />
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Something Went Wrong
          </h1>
          <p className="max-w-md text-muted-foreground">
            Something went wrong on our end. Please try refreshing the page, or
            contact support if the problem persists.
          </p>
          <Button onClick={() => reset()} variant="outline">
            Try Again
          </Button>
        </div>
      </body>
    </html>
  );
}
