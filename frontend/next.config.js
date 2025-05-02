/** @type {import('next').NextConfig} */
const nextConfig = {
  // Core Next.js configuration options
  reactStrictMode: true,

  // Other configurations added by specific tasks would appear here.
};

// Sentry configuration is handled primarily via environment variables,
// Vercel integration/CI steps, and instrumentation files (`instrumentation.ts`).
// VERIFY: Ensure this approach aligns with the project's final setup in fullstack-code,
// especially checking if the `withSentryConfig` HOC wrapper is used instead of this direct export.
module.exports = nextConfig;
