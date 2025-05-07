// File: frontend/jest.setup.js
// Task IDs: FE-076 (RTL Setup), FE-078 (MSW Setup)
// Description: Jest global setup file. Imports @testing-library/jest-dom for additional matchers
// and configures the MSW mock server lifecycle for integration tests, as required by US-FE-047 and US-FE-048.
// Status: Revised - No changes from baseline as it aligns with recommendations.

// Optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom/extend-expect";

// MSW Setup for API mocking in tests
import { server } from "./__tests__/mocks/server.js"; // Path confirmed via folder-structure.md

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
