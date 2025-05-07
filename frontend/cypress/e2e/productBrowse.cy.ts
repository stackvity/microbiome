// File: frontend/cypress/e2e/productBrowse.cy.ts
// Rationale: E2E test specifications for product browsing and detail page navigation.
// Task ID: FE-081 (Part of FE-BL-011 US-FE-050)
// Status: Revised - No changes from previous version as recommendations are external or verification-based.

describe("Product Browsing and Details", () => {
  beforeEach(() => {
    // Recommendation B.2: Consider using cy.intercept() here for API mocking.
    // e.g., cy.intercept('GET', '/api/store/products*', { fixture: 'products.json' }).as('getProducts');
  });

  it("BIO-CC-1-TC001: should display the product listing page with products", () => {
    cy.visit("/products");
    // If using intercept: cy.wait('@getProducts');

    // Recommendation A.1: Ensure 'product-list' and 'product-card-*' data-testid are in implemented components.
    cy.get('[data-testid="product-list"]', { timeout: 10000 }).should("exist");
    cy.get('[data-testid^="product-card-"]').should(
      "have.length.greaterThan",
      0
    );
  });

  it("BIO-CC-1-TC002: should navigate to a product detail page when a product card is clicked", () => {
    cy.visit("/products");
    // If using intercept: cy.wait('@getProducts');

    cy.get('[data-testid^="product-card-"]').first().click();

    cy.url().should("match", /\/products\/[a-zA-Z0-9-]+$/);

    // Recommendation A.1: Ensure 'product-detail-view', 'product-title', 'add-to-cart-button' data-testid are in implemented components.
    cy.get('[data-testid="product-detail-view"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.get('[data-testid="product-title"]').should("not.be.empty");
    cy.get('[data-testid="add-to-cart-button"]').should("be.visible");
  });
});
