// frontend/instrumentation.ts
// Sentry SDK initialization for server/edge runtimes (Next.js App Router).

let isSentryInitialized = false;

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' || process.env.NEXT_RUNTIME === 'edge') {
    if (isSentryInitialized) {
      return;
    }

    const Sentry = await import('@sentry/nextjs');

    Sentry.init({
      // DSN loaded from environment variables is critical.
      dsn: process.env.SENTRY_DSN,

      // Adjust sample rates for production vs development. Review these values based on monitoring needs and cost.
      tracesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,
      profilesSampleRate: process.env.NODE_ENV === 'development' ? 1.0 : 0.1,

      // Enable debug logging only in development.
      debug: process.env.NODE_ENV === 'development',

      // Optional: Client-side PII scrubbing hook (implement if needed for privacy).
      // beforeSend(event, hint) {
      //   // Example: Basic scrubbing (replace with more robust logic as needed)
      //   // WARNING: This is a simple example and might not cover all PII cases.
      //   try {
      //     if (event.request?.data) {
      //       // Modify or delete sensitive fields from event.request.data
      //     }
      //     // Scrub user identifiable info from breadcrumbs, etc.
      //   } catch (e) {
      //     console.error("Error in Sentry beforeSend:", e);
      //   }
      //   return event;
      // },
    });

    isSentryInitialized = true;
  }
  // Note: Client-side Sentry initialization is typically handled elsewhere
  // (e.g., root layout or sentry.client.config.js). Verify in fullstack-code.
}