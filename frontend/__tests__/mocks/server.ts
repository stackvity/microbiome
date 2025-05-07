// File: frontend/__tests__/mocks/server.ts
// Task IDs: FE-013, FE-048, FE-049, FE-050
// Status: Revised - Reverted explicit imports. Relies on global Jest types.

import { setupServer } from "msw/node";
import { handlers } from "./handlers"; // Import the revised handlers
// Note: The Jest lifecycle hooks (beforeAll, afterEach, afterAll) are expected
// to be available globally in a Jest environment. If TypeScript shows errors
// (TS2304), ensure '@types/jest' is installed as a dev dependency and the
// 'tsconfig.json' is configured correctly (e.g., includes "jest" in types
// or relies on automatic type acquisition).

// Setup requests interception using the imported handlers for Node environment (Jest).
export const server = setupServer(...handlers);

// Standard Jest lifecycle hooks for MSW server management.
// These should be globally available via @types/jest.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
