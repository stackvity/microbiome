// File: frontend/cypress/e2e/auth.cy.ts
// Rationale: E2E test specifications for authentication flows (Login).
// Task ID: FE-080 (Part of FE-BL-011 US-FE-050)
// Status: Revised - No changes from previous version as recommendations are external or verification-based.

describe("Authentication Flows", () => {
  const customerEmail =
    Cypress.env("CUSTOMER_EMAIL") || "customer.login@example.com";
  const customerPassword = Cypress.env("CUSTOMER_PASSWORD") || "ValidPassCust1";
  const unapprovedVendorEmail =
    Cypress.env("PENDING_VENDOR_EMAIL") || "vendor.pending@example.com";
  const unapprovedVendorPassword =
    Cypress.env("PENDING_VENDOR_PASSWORD") || "ValidPassPend1";

  beforeEach(() => {
    cy.visit("/login");
  });

  it("BIO-UM-2-TC001: should allow a registered customer to log in successfully and redirect to dashboard", () => {
    cy.get('[data-testid="email-input"]').should("be.visible");
    cy.get('[data-testid="password-input"]').should("be.visible");
    cy.get('[data-testid="login-button"]').should("be.visible");

    cy.get('[data-testid="email-input"]').type(customerEmail);
    cy.get('[data-testid="password-input"]').type(customerPassword);
    cy.get('[data-testid="login-button"]').click();

    cy.url().should("include", "/account/dashboard");
    cy.get("h1").contains("Account Dashboard").should("be.visible");
  });

  it("BIO-UM-2-TC004: should display an error message for invalid password", () => {
    cy.get('[data-testid="email-input"]').type(customerEmail);
    cy.get('[data-testid="password-input"]').type("WrongPassword!!");
    cy.get('[data-testid="login-button"]').click();

    // Recommendation A.2: Exact wording "Invalid email or password." to be verified against actual UI.
    cy.contains("Invalid email or password.").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("BIO-UM-2-TC005: should display an error message for a non-existent email", () => {
    cy.get('[data-testid="email-input"]').type("does.not.exist@example.com");
    cy.get('[data-testid="password-input"]').type("AnyPassword123");
    cy.get('[data-testid="login-button"]').click();

    // Recommendation A.2: Exact wording "Invalid email or password." to be verified against actual UI.
    cy.contains("Invalid email or password.").should("be.visible");
    cy.url().should("include", "/login");
  });

  it("BIO-UM-2-TC006: should display an error message for an unapproved (pending) vendor", () => {
    cy.get('[data-testid="email-input"]').type(unapprovedVendorEmail);
    cy.get('[data-testid="password-input"]').type(unapprovedVendorPassword);
    cy.get('[data-testid="login-button"]').click();

    // Recommendation A.2: Exact wording "Your vendor application is pending review." to be verified against actual UI.
    cy.contains("Your vendor application is pending review.").should(
      "be.visible"
    );
    cy.url().should("include", "/login");
  });
});
