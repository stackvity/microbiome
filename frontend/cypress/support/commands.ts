// File: frontend/cypress/support/commands.ts
// Rationale: Cypress custom commands file, including Axe accessibility check setup.
// Task ID: FE-079, FE-089 (Part of FE-BL-011 US-FE-049, US-FE-057)
// Status: Corrected to resolve TypeScript errors TS2322 and TS2345.

// Import cypress-axe for accessibility testing
import "cypress-axe";
// Import types directly from axe-core
import type {
  Result,
  ElementContext, // Use this directly from axe-core
  RunOptions as AxeRunOptions,
  NodeResult,
  // ContextObject is part of ElementContext
} from "axe-core";

// Augment the Cypress namespace to include the custom command
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Custom command to check for accessibility violations using cypress-axe.
       * Runs Axe on the current subject (or the whole document) and logs violations.
       * By default, this command will now fail the test if any violations are found.
       * To allow violations (e.g., during initial setup or for known issues), pass
       * `failOnViolation: false` in the options object.
       * @example
       * cy.checkAccessibility(); // Checks the whole page, fails on violation
       * cy.checkAccessibility(null, { failOnViolation: false }); // Checks whole page, logs but doesn't fail
       * cy.checkAccessibility({ rules: { 'color-contrast': { enabled: false } }, failOnViolation: true }); // Options only
       * cy.get('main').checkAccessibility(); // Checks only the main element
       * cy.get('main').checkAccessibility({ rules: { 'color-contrast': { enabled: false } } });
       */
      checkAccessibility(
        context?:
          | ElementContext // Use ElementContext from axe-core
          | (AxeRunOptions & { failOnViolation?: boolean }),
        options?: AxeRunOptions & { failOnViolation?: boolean }
      ): Chainable<Subject>;
    }
  }
}

Cypress.Commands.add(
  "checkAccessibility",
  {
    prevSubject: "optional" as any,
  },
  (
    invokedSubject: Cypress.PrevSubject | null,
    firstArgument?:
      | ElementContext // Use ElementContext from axe-core
      | (AxeRunOptions & { failOnViolation?: boolean }),
    secondArgument?: AxeRunOptions & { failOnViolation?: boolean }
  ) => {
    let axeContextToPass: ElementContext | undefined; // MODIFIED: Allow undefined for TS2322
    let userProvidedAxeOptions: AxeRunOptions | undefined;
    let failOnViolation = true; // Default

    if (invokedSubject) {
      // When chained, invokedSubject is Cypress.PrevSubject (jQuery element)
      // cypress-axe's checkA11y handles this type directly for context.
      axeContextToPass = invokedSubject as unknown as ElementContext; // JQuery element is fine for ElementContext
      if (firstArgument && typeof firstArgument === "object") {
        const { failOnViolation: fov, ...rest } =
          firstArgument as AxeRunOptions & { failOnViolation?: boolean };
        userProvidedAxeOptions =
          Object.keys(rest).length > 0 ? rest : undefined;
        if (fov !== undefined) failOnViolation = fov;
      }
    } else {
      // Not chained: cy.checkAccessibility(context, options), cy.checkAccessibility(options), or cy.checkAccessibility()
      const isFirstArgDefinitelyContext =
        typeof firstArgument === "string" ||
        firstArgument instanceof Node ||
        (Array.isArray(firstArgument) && // For NodeResult[] or string[] (NodeSelector)
          firstArgument.every(
            (item) => item instanceof Node || typeof item === "string"
          )) ||
        firstArgument === null; // Explicitly allow null for document context

      const isFirstArgPotentiallyOptions =
        firstArgument &&
        typeof firstArgument === "object" &&
        Object.keys(firstArgument).some((key) =>
          [
            "rules",
            "runOnly",
            "reporter",
            "includedImpacts",
            "resultTypes",
            "selectors",
            "iframes",
            "elementRef",
            "frameWaitTime",
            "preload",
            "performanceTimer",
            "pingWaitTime",
            "timeout",
            "ancestry",
            "xpath",
            "assert",
            "locale",
            "scanner",
            "standards",
            "disableOtherRules",
            "failOnViolation",
          ].includes(key)
        );

      if (isFirstArgDefinitelyContext) {
        axeContextToPass = firstArgument as ElementContext; // Assign directly
        if (secondArgument && typeof secondArgument === "object") {
          const { failOnViolation: fov, ...rest } = secondArgument;
          userProvidedAxeOptions =
            Object.keys(rest).length > 0 ? rest : undefined;
          if (fov !== undefined) failOnViolation = fov;
        }
      } else if (isFirstArgPotentiallyOptions) {
        axeContextToPass = undefined; // MODIFIED: This assignment is now valid for TS2322
        const { failOnViolation: fov, ...rest } =
          firstArgument as AxeRunOptions & { failOnViolation?: boolean };
        userProvidedAxeOptions =
          Object.keys(rest).length > 0 ? rest : undefined;
        if (fov !== undefined) failOnViolation = fov;
      } else if (firstArgument === undefined) {
        axeContextToPass = undefined; // MODIFIED: This assignment is now valid for TS2322
        if (secondArgument && typeof secondArgument === "object") {
          const { failOnViolation: fov, ...rest } = secondArgument;
          userProvidedAxeOptions =
            Object.keys(rest).length > 0 ? rest : undefined;
          if (fov !== undefined) failOnViolation = fov;
        }
      } else {
        // Fallback: firstArgument is an object but not clearly options. Assume it's context.
        // `ElementContext` can be `ContextObject`, so {} is assignable.
        axeContextToPass = firstArgument as ElementContext;
        if (secondArgument && typeof secondArgument === "object") {
          const { failOnViolation: fov, ...rest } = secondArgument;
          userProvidedAxeOptions =
            Object.keys(rest).length > 0 ? rest : undefined;
          if (fov !== undefined) failOnViolation = fov;
        }
      }
    }

    const effectiveRunOptions: AxeRunOptions & { includedImpacts?: string[] } =
      {
        ...(userProvidedAxeOptions || {}),
        includedImpacts: ["critical", "serious", "moderate", "minor"],
      };

    const violationCallback = (violations: Result[]) => {
      if (violations.length > 0) {
        const violationData = violations.map(
          ({ id, impact, description, nodes, helpUrl }) => ({
            id,
            impact,
            description,
            nodes: nodes.length,
            html: nodes.length > 0 ? nodes[0].html : "N/A",
            helpUrl,
          })
        );
        Cypress.log({
          name: "Axe Violations",
          message: `${violations.length} accessibility violation(s) detected`,
          consoleProps: () => ({ violations: violationData }),
        });
        cy.task("log", `ACCESSIBILITY VIOLATIONS (${violations.length}):`);
        cy.task("table", violationData);

        if (failOnViolation) {
          const summary = violations
            .map(
              (v) =>
                `  - ${v.id} (${v.impact || "N/A"}): ${v.nodes.length} nodes. ${
                  v.helpUrl
                }`
            )
            .join("\n");
          throw new Error(
            `Accessibility violations found:\n${summary}\nSee Cypress log for details.`
          );
        }
      }
    };

    cy.injectAxe();
    // MODIFIED: Cast axeContextToPass to `any` to bypass potentially restrictive
    // cypress-axe type definition for `checkA11y`'s context parameter,
    // as `axe.run` (which it calls) is more flexible and can handle the full ElementContext.
    cy.checkA11y(
      axeContextToPass as any,
      effectiveRunOptions,
      violationCallback
    );
  }
);
