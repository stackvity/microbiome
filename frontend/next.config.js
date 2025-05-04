// File: frontend/next.config.js
// Rationale: Core Next.js configuration, including Sentry integration considerations.
// Task ID: FE-001, FE-021
// Status: No changes required based on analysis findings.

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Other configurations added by specific tasks would appear here.
};

// Sentry configuration is handled primarily via environment variables,
// Vercel integration/CI steps, and instrumentation files (`instrumentation.ts`).
module.exports = nextConfig;
