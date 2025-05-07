// File: frontend/jest.config.js
// Task ID: FE-076 (Jest Configuration)
// Description: Jest configuration for the Next.js frontend application.
// Defines test environment, setup files, module mappings, and code coverage settings
// as required by US-FE-047. Includes initial coverage thresholds.
// Status: Revised - Applied optional recommendation B.2 (Coverage Thresholds).

const nextJest = require("next/jest");

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: "./",
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured by `createJestConfig` if you have `compilerOptions.paths` set in `tsconfig.json`)
    // Example:
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/hooks/(.*)$": "<rootDir>/hooks/$1",
    "^@/lib/(.*)$": "<rootDir>/lib/$1",
    "^@/store/(.*)$": "<rootDir>/store/$1",
    "^@/app/(.*)$": "<rootDir>/app/$1",
    // Add other aliases here if needed
  },
  // Enable code coverage
  collectCoverage: true,
  // Specify directories/files to collect coverage from
  collectCoverageFrom: [
    "components/**/*.{ts,tsx}",
    "hooks/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "store/**/*.{ts,tsx}",
    "app/**/*.{ts,tsx}", // Include app directory components and logic
    "!app/**/layout.tsx", // Exclude root layout files from coverage if they are mostly boilerplate
    "!app/**/page.tsx", // Exclude simple page files if they mostly use containers
    "!app/**/error.tsx", // Exclude error boundary files
    "!app/**/not-found.tsx", // Exclude not-found files
    "!app/api/**", // Exclude Next.js API routes
    "!**/*.d.ts", // Exclude type definition files
    "!**/node_modules/**",
    "!<rootDir>/.next/**",
    "!<rootDir>/*.config.js",
    "!<rootDir>/coverage/**",
    "!<rootDir>/instrumentation.ts", // Exclude instrumentation file
  ],
  // Specify coverage reporters
  coverageReporters: ["json", "lcov", "text", "clover"],
  // Set a coverage threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testPathIgnorePatterns: [
    "<rootDir>/node_modules/",
    "<rootDir>/.next/",
    "<rootDir>/cypress/",
  ], // Ensure Cypress tests are ignored by Jest
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    "^.+\\.(js|jsx|ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }],
  },
  transformIgnorePatterns: [
    "/node_modules/",
    "^.+\\.module\\.(css|sass|scss)$",
  ],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
