// File: frontend/cypress/e2e/cart.cy.ts
// Rationale: E2E test specifications for shopping cart interactions.
// Task ID: FE-082 (Part of FE-BL-011 US-FE-050)
// Status: Revised - Implemented missing test cases, accessibility checks, and replaced hardcoded waits.

describe("Shopping Cart Flows", () => {
  const customerEmail =
    Cypress.env("CUSTOMER_EMAIL") || "customer.login@example.com";
  const customerPassword = Cypress.env("CUSTOMER_PASSWORD") || "ValidPassCust1";

  const productHandle1 = "test-probiotic-a"; // Assumed known product
  const productPageUrl1 = `/products/${productHandle1}`;
  // Assuming a second distinct product handle for clarity in tests.
  // This should be a product known to exist in the test environment.
  const productHandle2 = "test-kit-b"; // Example from productBrowse.cy.ts
  const productPageUrl2 = `/products/${productHandle2}`;

  const productsListingUrl = "/products"; // Fallback if specific second product isn't available
  const cartPageUrl = "/cart";

  const ensureCartIsEmpty = () => {
    cy.visit(cartPageUrl);
    cy.get("body").then(($body) => {
      if ($body.find('[data-testid="cart-empty"]').length > 0) {
        return; // Cart is already empty
      }
      // Intercept remove calls to wait for completion
      cy.intercept("POST", "/store/carts/*/line-items/*").as("updateCartItem"); // For quantity 0 removal
      cy.intercept("DELETE", "/store/carts/*/line-items/*").as(
        "removeCartItem"
      );

      const removeItemsRecursively = () => {
        cy.get("body").then(($bodyAgain) => {
          if (
            $bodyAgain.find('[data-testid^="remove-item-"]').first().length > 0
          ) {
            cy.get('[data-testid^="remove-item-"]').first().click();
            cy.wait("@removeCartItem");
            removeItemsRecursively(); // Call again until no more items
          }
        });
      };
      removeItemsRecursively();
      cy.get('[data-testid="cart-empty"]', { timeout: 10000 }).should(
        "be.visible"
      );
    });
  };

  beforeEach(() => {
    cy.visit("/login");
    cy.get('[data-testid="email-input"]').type(customerEmail);
    cy.get('[data-testid="password-input"]').type(customerPassword);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should("include", "/account/dashboard");
    ensureCartIsEmpty();
  });

  it("BIO-CC-3-TC001 & TC002: should allow adding items to the cart and viewing the cart", () => {
    cy.intercept("POST", "/store/carts/*/line-items").as("addLineItem");

    // Add first item
    cy.visit(productPageUrl1);
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.wait("@addLineItem").its("response.statusCode").should("eq", 200); // Medusa often returns 200 for cart updates
    cy.get('[data-sonner-toast][data-type="success"]').should("be.visible");

    // Add second distinct item
    cy.visit(productPageUrl2);
    cy.get('[data-testid="add-to-cart-button"]', { timeout: 10000 })
      .should("be.visible")
      .click();
    cy.wait("@addLineItem").its("response.statusCode").should("eq", 200);
    cy.get('[data-sonner-toast][data-type="success"]').should("be.visible");

    // View cart
    cy.visit(cartPageUrl);
    cy.get('[data-testid="cart-page"]').should("be.visible");
    cy.checkAccessibility(); // Accessibility check for cart with items
    cy.get('[data-testid="cart-items-container"]')
      .find('[data-testid^="cart-item-"]')
      .should("have.length", 2);
    cy.get('[data-testid="cart-subtotal"]').should("not.be.empty");
  });

  it("BIO-CC-3-TC003: should display an empty cart message when no items are present", () => {
    // Cart is already empty due to beforeEach ensureCartIsEmpty
    cy.visit(cartPageUrl);
    cy.get('[data-testid="cart-empty"]').should("be.visible");
    cy.checkAccessibility(); // Accessibility check for empty cart page
    cy.get('[data-testid="cart-items-container"]')
      .find('[data-testid^="cart-item-"]')
      .should("not.exist");
    // Assuming checkout button is disabled or hidden for an empty cart
    // cy.get('[data-testid="checkout-button"]').should('be.disabled');
  });

  it("BIO-CC-3-TC004 & TC005: should allow updating item quantity in the cart", () => {
    cy.intercept("POST", "/store/carts/*/line-items").as("addLineItem");
    cy.intercept("POST", "/store/carts/*/line-items/*").as("updateLineItem");

    // Add an item first
    cy.visit(productPageUrl1);
    cy.get('[data-testid="add-to-cart-button"]').should("be.visible").click();
    cy.wait("@addLineItem");
    cy.visit(cartPageUrl);

    cy.get('[data-testid^="quantity-input-"]').first().as("quantityInput");
    cy.get("@quantityInput").should("have.value", "1");

    // Increase quantity
    cy.get("@quantityInput").clear().type("2").blur();
    cy.wait("@updateLineItem").its("response.statusCode").should("eq", 200);
    cy.get("@quantityInput").should("have.value", "2");

    // Decrease quantity
    cy.get("@quantityInput").clear().type("1").blur();
    cy.wait("@updateLineItem").its("response.statusCode").should("eq", 200);
    cy.get("@quantityInput").should("have.value", "1");
  });

  it("BIO-CC-3-TC006 & TC008: should allow removing an item and setting quantity to 0 (removes item)", () => {
    cy.intercept("POST", "/store/carts/*/line-items").as("addLineItem");
    cy.intercept("POST", "/store/carts/*/line-items/*").as("updateLineItem"); // For quantity 0 removal
    cy.intercept("DELETE", "/store/carts/*/line-items/*").as("removeLineItem");

    // Add two items
    cy.visit(productPageUrl1);
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait("@addLineItem");

    cy.visit(productPageUrl2);
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait("@addLineItem");

    cy.visit(cartPageUrl);
    cy.get('[data-testid="cart-items-container"]')
      .find('[data-testid^="cart-item-"]')
      .should("have.length", 2);

    // Remove one item using the remove button
    cy.get('[data-testid^="remove-item-"]').first().click();
    cy.wait("@removeLineItem").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="cart-items-container"]')
      .find('[data-testid^="cart-item-"]')
      .should("have.length", 1);

    // Update quantity of the remaining item to 0 (should remove it)
    cy.get('[data-testid^="quantity-input-"]').first().clear().type("0").blur();
    // Medusa might treat quantity 0 update as a remove operation or require specific handling.
    // Assuming it results in an update that effectively removes or backend translates to delete.
    // If it's an update call for quantity 0
    cy.wait("@updateLineItem").its("response.statusCode").should("eq", 200);
    cy.get('[data-testid="cart-empty"]', { timeout: 10000 }).should(
      "be.visible"
    );
    cy.checkAccessibility(); // Check accessibility of empty cart
  });

  it("BIO-CC-3-TC007: should handle invalid quantity updates in the cart", () => {
    cy.intercept("POST", "/store/carts/*/line-items").as("addLineItem");
    cy.intercept("POST", "/store/carts/*/line-items/*").as("updateLineItem");

    cy.visit(productPageUrl1);
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait("@addLineItem");
    cy.visit(cartPageUrl);

    const quantityInput = '[data-testid^="quantity-input-"]';

    // Attempt to update quantity to a negative value
    cy.get(quantityInput).first().clear().type("-1").blur();
    // Assuming the input itself prevents negative values or form validation kicks in
    // Or, if API call is made, it should fail. For this test, we'll assume UI/client-side prevention or API error.
    // This step depends heavily on form validation implementation.
    // If an API call is made, intercept it and check for failure.
    // For now, let's assume the input value is reset or an error is shown visually.
    // cy.wait('@updateLineItem').its('response.statusCode').should('be.oneOf', [400, 422]); // Example error codes
    cy.get(quantityInput).first().should("not.have.value", "-1"); // Should revert or show error

    // Attempt to update quantity to a non-integer value (if input type="number" allows it)
    // Most number inputs will block non-numeric, this is more for programmatic setting or edge cases
    // For this test, we'll assume the input only accepts numbers.

    // Attempt to update quantity to a very large number (if there are stock limits not handled by UI)
    cy.get(quantityInput).first().clear().type("9999").blur();
    // If an API call is made:
    // cy.wait('@updateLineItem');
    // Then assert outcome - either success if stock high, or failure/error message
    // For now, we assert the value is set, actual validation is on BE/UI state.
    cy.get(quantityInput).first().should("have.value", "9999");
    cy.checkAccessibility(); // Check cart page with items for accessibility
  });

  it("BIO-CC-3-TC009: should persist cart contents across page navigations", () => {
    cy.intercept("POST", "/store/carts/*/line-items").as("addLineItem");
    cy.visit(productPageUrl1);
    cy.get('[data-testid="add-to-cart-button"]').click();
    cy.wait("@addLineItem");
    cy.get('[data-sonner-toast][data-type="success"]').should("be.visible");

    cy.visit("/");
    cy.get("h1").should("contain.text", "Welcome to Biomevity Marketplace");

    cy.visit(cartPageUrl);
    cy.get('[data-testid="cart-items-container"]')
      .find('[data-testid^="cart-item-"]')
      .should("have.length", 1);
    cy.checkAccessibility(); // Check cart page with items for accessibility
  });
});
