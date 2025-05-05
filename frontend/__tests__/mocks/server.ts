// File: frontend/__tests__/mocks/server.ts
// Task IDs: FE-013, FE-048, FE-049, FE-050
// Status: Revised (No functional changes needed, just ensures correct import).

import { setupServer } from "msw/node";
import { handlers } from "./handlers"; // Import the revised handlers

// Setup requests interception using the imported handlers for Node environment (Jest).
export const server = setupServer(...handlers);

// Standard Jest lifecycle hooks for MSW server management.
beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
