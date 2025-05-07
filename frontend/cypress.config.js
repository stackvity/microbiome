// File: frontend/cypress.config.js
// Rationale: Cypress E2E framework configuration, including baseUrl.
// Task ID: FE-079 (Part of FE-BL-011 US-FE-049)
// Status: Revised - Aligns with recommendations. Optional Improvement B.3 noted.

const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Recommendation B.3: Consider making baseUrl configurable via Cypress environment variables
    // e.g., baseUrl: Cypress.env('BASE_URL') || "http://localhost:3000",
    // For this revision, keeping the direct value as per initial generation.
    baseUrl: "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.ts",
    fixturesFolder: "cypress/fixtures",
    screenshotsFolder: "cypress/screenshots",
    videosFolder: "cypress/videos",
    // setupNodeEvents(on, config) {
    // implement node event listeners here
    // },
  },
  // component: {
  //   devServer: {
  //     framework: "next",
  //     bundler: "webpack",
  //   },
  // },
});
