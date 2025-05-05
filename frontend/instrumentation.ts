// File: frontend/instrumentation.ts
// Rationale: Recommended Sentry SDK initialization point for Next.js App Router, handling both server/client init.
// Task ID: FE-021, FE-088
// Status: Revised based on recommendations (Added environment context).

import * as Sentry from "@sentry/nextjs";

if (process.env.NEXT_RUNTIME === "nodejs" && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
    // Distinguish events from different deployment environments
    environment: process.env.NODE_ENV || "development",
    debug: process.env.NODE_ENV === "development",
  });
  console.log("Sentry initialized for Node.js runtime.");
} else if (process.env.NEXT_RUNTIME === "edge" && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    tracesSampleRate: 1.0,
    // Distinguish events from different deployment environments
    environment: process.env.NODE_ENV || "development",
    debug: process.env.NODE_ENV === "development",
  });
  console.log("Sentry initialized for Edge runtime.");
}

// Note: Client-side initialization uses NEXT_PUBLIC_SENTRY_DSN and is handled
// automatically via Sentry's Next.js configuration (e.g., next.config.js).
