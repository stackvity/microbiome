// File: frontend/cypress/support/commands.ts
// Rationale: Cypress custom commands file, including Axe accessibility check setup.
// Task ID: FE-079, FE-089 (Part of FE-BL-011 US-FE-049, US-FE-057)
// Status: Revised - Added explicit import for axe-core types and typed violations parameter. TSConfig updated for cypress-axe types.

// Import cypress-axe for accessibility testing
import "cypress-axe";
// Import types directly from axe-core
import type { ContextObject, RunOptions, Result } from "axe-core"; // Added Result type

// Augment the Cypress namespace to include the custom command
// This is for TypeScript type checking
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to check for accessibility violations using cypress-axe.
       * Runs Axe on the current subject (or the whole document) and logs violations.
       * @example
       * cy.checkAccessibility(); // Checks the whole page
       * cy.checkAccessibility({ rules: { 'color-contrast': { enabled: false } } }); // Checks whole page with options
       * cy.checkAccessibility('main', { rules: { 'color-contrast': { enabled: false } } }); // Checks 'main' element with options
       * cy.get('main').checkAccessibility(); // Checks only the main element
       * cy.get('main').checkAccessibility({ rules: { 'color-contrast': { enabled: false } } }); // Checks main element with options
       */
      checkAccessibility(
        context?: ContextObject | Node | string | RunOptions, // Can be context or options if no subject
        options?: RunOptions // Options if context was provided
      ): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add(
  "checkAccessibility",
  {
    prevSubject: "optional" as any, // 'any' helps with some TS complexities here
  },
  // Parameters of the implementation function:
  // 1. `invokedSubject`: The subject from the Cypress chain (e.g., JQuery<HTMLElement> or null if called on `cy`).
  // 2. `firstArgument`: The first argument passed to `cy.checkAccessibility(...)`.
  // 3. `secondArgument`: The second argument passed to `cy.checkAccessibility(...)`.
  (
    invokedSubject: Cypress.PrevSubject | null, // Cypress passes null when not chained on a subject
    firstArgument?: ContextObject | Node | string | RunOptions,
    secondArgument?: RunOptions
  ) => {
    let axeContext:
      | ContextObject
      | Node
      | string
      | Cypress.PrevSubject // This includes the subject type from Cypress chain
      | undefined;
    let axeOptions: RunOptions | undefined;

    if (invokedSubject) {
      // Command was chained, e.g., cy.get(...).checkAccessibility(options)
      axeContext = invokedSubject;
      axeOptions = firstArgument as RunOptions | undefined; // The first arg to our command is the options for checkA11y
    } else {
      // Command was not chained, e.g., cy.checkAccessibility(context, options) or cy.checkAccessibility(options)
      // We need to determine if `firstArgument` is context or options.
      if (
        typeof firstArgument === "string" ||
        firstArgument instanceof Node ||
        (firstArgument &&
          typeof firstArgument === "object" &&
          !(
            "rules" in firstArgument ||
            "runOnly" in firstArgument ||
            "reporter" in firstArgument
          )) // Heuristic: if it doesn't look like RunOptions, it's Context
      ) {
        axeContext = firstArgument as ContextObject | Node | string | undefined;
        axeOptions = secondArgument;
      } else {
        // firstArgument is likely options
        axeContext = undefined; // Check the whole page
        axeOptions = firstArgument as RunOptions | undefined;
      }
    }

    cy.injectAxe();

    // Call the original cy.checkA11y with the derived context and options
    // Typed the violations parameter here
    cy.checkA11y(axeContext, axeOptions, (violations: Result[]) => {
      if (violations.length > 0) {
        cy.task(
          "log",
          `${violations.length} accessibility violation${
            violations.length === 1 ? "" : "s"
          } ${violations.length === 1 ? "was" : "were"} detected`
        );
        const violationData = violations.map(
          ({ id, impact, description, nodes }) => ({
            id,
            impact,
            description,
            nodes: nodes.length,
            html: nodes.length > 0 ? nodes[0].html : "N/A",
          })
        );
        cy.task("table", violationData);
      }
    });
  }
);
