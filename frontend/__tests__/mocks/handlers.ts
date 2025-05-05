// File: frontend/__tests__/mocks/handlers.ts
// Task IDs: FE-013, FE-048, FE-049, FE-050
// Status: Revised based on recommendations. Added validation error mocks, expanded mock data.

import { http, HttpResponse } from "msw";

// Use environment variable or default for test consistency
const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

// --- Mock Data Structures ---

const mockProducts = {
  products: [
    {
      id: "prod_1",
      title: "Test Probiotic A",
      handle: "test-probiotic-a",
      thumbnail: "/test-thumb.jpg",
      variants: [
        { id: "variant_1", prices: [{ amount: 2999, currency_code: "usd" }] },
      ],
    },
    {
      id: "prod_2",
      title: "Test Kit B",
      handle: "test-kit-b",
      thumbnail: "/test-thumb-2.jpg",
      variants: [
        { id: "variant_2", prices: [{ amount: 9999, currency_code: "usd" }] },
      ],
    },
    {
      id: "prod_3",
      title: "Prebiotic Fiber C",
      handle: "prebiotic-fiber-c",
      thumbnail: null,
      variants: [
        { id: "variant_3", prices: [{ amount: 1999, currency_code: "usd" }] },
      ],
    }, // Added variation (B.2)
  ],
  count: 3,
  limit: 10,
  offset: 0,
};

const mockSingleProduct = {
  product: {
    id: "prod_1",
    title: "Test Probiotic A",
    handle: "test-probiotic-a",
    description: "Detailed description for Test Probiotic A.",
    thumbnail: "/test-thumb.jpg",
    images: [{ id: "img_1", url: "/test-img.jpg" }],
    variants: [
      {
        id: "variant_1",
        title: "Standard",
        inventory_quantity: 10,
        prices: [{ amount: 2999, currency_code: "usd" }],
      },
    ],
    options: [
      {
        id: "opt_1",
        title: "Size",
        values: [{ id: "optval_1", value: "Standard" }],
      },
    ],
    vendor_name: "Test Vendor Inc.",
    average_rating: 4.2,
    review_count: 15,
  },
};

const mockCustomer = {
  customer: {
    id: "cus_123",
    email: "test@example.com",
    first_name: "Test",
    last_name: "User",
    role: "customer",
    shipping_addresses: [
      {
        id: "addr_1",
        first_name: "Test",
        last_name: "User",
        address_1: "123 Main St",
        city: "Anytown",
        postal_code: "12345",
        country_code: "us",
        province: "CA",
        is_default_shipping: true,
        is_default_billing: true,
      },
      {
        id: "addr_2",
        first_name: "Work",
        last_name: "Address",
        address_1: "456 Business Ave",
        city: "Anytown",
        postal_code: "12345",
        country_code: "us",
        province: "CA",
        is_default_shipping: false,
        is_default_billing: false,
      },
    ],
  },
};

// Added cart with multiple items (B.2)
const mockCart = {
  cart: {
    id: "cart_123",
    email: "test@example.com",
    region_id: "reg_us",
    items: [
      {
        id: "item_1",
        title: "Test Probiotic A",
        description: "Standard",
        quantity: 2,
        unit_price: 2999,
        thumbnail: "/test-thumb.jpg",
        variant_id: "variant_1",
      },
      {
        id: "item_2",
        title: "Test Kit B",
        description: "Standard",
        quantity: 1,
        unit_price: 9999,
        thumbnail: "/test-thumb-2.jpg",
        variant_id: "variant_2",
      },
    ],
    subtotal: 2 * 2999 + 9999,
    shipping_total: 0,
    tax_total: 0,
    total: 2 * 2999 + 9999,
  },
};

// --- MSW Handlers ---

/**
 * Array of request handlers for Mock Service Worker (MSW).
 * Used in Jest tests to mock API responses.
 */
export const handlers = [
  // --- Product Catalog Mocks (FE-013) ---
  http.get(`${MEDUSA_BACKEND_URL}/store/products`, () =>
    HttpResponse.json(mockProducts)
  ),
  http.get(
    `${MEDUSA_BACKEND_URL}/store/products/:productIdOrHandle`,
    ({ params }) => {
      const idOrHandle = params.productIdOrHandle;
      if (idOrHandle === "prod_1" || idOrHandle === "test-probiotic-a") {
        return HttpResponse.json(mockSingleProduct);
      }
      // Add mock for prod_2 if needed for detail view tests
      if (idOrHandle === "prod_2" || idOrHandle === "test-kit-b") {
        // Return a simplified mock for prod_2
        return HttpResponse.json({
          product: {
            id: "prod_2",
            title: "Test Kit B",
            handle: "test-kit-b",
            thumbnail: "/test-thumb-2.jpg",
            variants: [
              {
                id: "variant_2",
                prices: [{ amount: 9999, currency_code: "usd" }],
              },
            ],
          },
        });
      }
      return HttpResponse.json(
        { error: { code: "NOT_FOUND", message: "Product not found" } },
        { status: 404 }
      );
    }
  ),

  // --- Authentication Mocks (FE-049) ---
  http.post(`${MEDUSA_BACKEND_URL}/store/auth`, async ({ request }) => {
    const credentials = await request.json();
    if (!credentials?.email || !credentials?.password) {
      // Added validation mock (A.4)
      return HttpResponse.json(
        {
          error: {
            code: "BAD_REQUEST",
            message: "Email and password are required.",
          },
        },
        { status: 400 }
      );
    }
    if (
      credentials.email === "test@example.com" &&
      credentials.password === "password"
    ) {
      return HttpResponse.json(mockCustomer);
    }
    if (credentials.email === "pending@example.com") {
      return HttpResponse.json(
        {
          error: {
            code: "VENDOR_NOT_APPROVED",
            message: "Your vendor application is pending review.",
          },
        },
        { status: 403 }
      );
    }
    return HttpResponse.json(
      {
        error: {
          code: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
      },
      { status: 401 }
    );
  }),
  http.get(`${MEDUSA_BACKEND_URL}/store/auth`, ({ cookies }) => {
    if (cookies.connectsid === "mock-session-id") {
      return HttpResponse.json(mockCustomer);
    }
    return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
  }),
  http.delete(
    `${MEDUSA_BACKEND_URL}/store/auth`,
    () => new HttpResponse(null, { status: 200 })
  ),

  // --- Registration Mocks (FE-049) ---
  http.post(`${MEDUSA_BACKEND_URL}/store/customers`, async ({ request }) => {
    const regData = await request.json();
    if (!regData?.email || !regData?.password || !regData?.first_name) {
      // Added validation mock (A.4)
      return HttpResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required registration fields.",
          },
          details: [
            { field: "email/password/first_name", message: "Required" },
          ],
        },
        { status: 400 }
      );
    }
    if (regData.email === "exists@example.com") {
      return HttpResponse.json(
        {
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email already exists.",
          },
        },
        { status: 409 }
      );
    }
    // Simulate password too short error (A.4)
    if (regData.password?.length < 8) {
      return HttpResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Password must be at least 8 characters.",
          },
          details: [{ field: "password", message: "Too short" }],
        },
        { status: 422 }
      );
    }
    return HttpResponse.json(mockCustomer, { status: 200 });
  }),
  http.post(`${MEDUSA_BACKEND_URL}/store/vendors`, async ({ request }) => {
    // Custom endpoint assumed
    const regData = await request.json();
    if (!regData?.email || !regData?.password || !regData?.business_name) {
      // Added validation mock (A.4)
      return HttpResponse.json(
        {
          error: {
            code: "VALIDATION_ERROR",
            message: "Missing required vendor fields.",
          },
        },
        { status: 400 }
      );
    }
    if (regData.email === "exists@example.com") {
      return HttpResponse.json(
        {
          error: {
            code: "EMAIL_ALREADY_EXISTS",
            message: "An account with this email already exists.",
          },
        },
        { status: 409 }
      );
    }
    return HttpResponse.json(
      {
        customer: {
          id: `user_pending_${Date.now()}`,
          email: regData.email,
          first_name: regData.first_name,
          role: "vendor",
          vendor_status: "pending",
        },
      },
      { status: 200 }
    );
  }),

  // --- Cart Mocks (FE-050) ---
  http.post(`${MEDUSA_BACKEND_URL}/store/carts`, () =>
    HttpResponse.json({
      cart: {
        id: `cart_${Date.now()}`,
        email: null,
        region_id: "reg_us",
        items: [],
        subtotal: 0,
        total: 0,
      },
    })
  ),
  http.get(`${MEDUSA_BACKEND_URL}/store/carts/:cartId`, ({ params }) => {
    if (params.cartId === "cart_123") return HttpResponse.json(mockCart);
    return HttpResponse.json(
      { error: { code: "NOT_FOUND", message: "Cart not found" } },
      { status: 404 }
    );
  }),
  http.post(
    `${MEDUSA_BACKEND_URL}/store/carts/:cartId/line-items`,
    async ({ request, params }) => {
      if (params.cartId !== "cart_123")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Cart not found" } },
          { status: 404 }
        );
      const { variant_id, quantity } = await request.json();
      if (!variant_id || !Number.isInteger(quantity) || quantity <= 0) {
        // Added validation mock (A.4)
        return HttpResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Variant ID and positive integer quantity required.",
            },
          },
          { status: 400 }
        );
      }
      // Simplified success response - return updated cart
      return HttpResponse.json(mockCart); // Return base mock for simplicity in test setup
    }
  ),
  http.post(
    `${MEDUSA_BACKEND_URL}/store/carts/:cartId/line-items/:lineItemId`,
    async ({ request, params }) => {
      if (params.cartId !== "cart_123")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Cart not found" } },
          { status: 404 }
        );
      const { quantity } = await request.json();
      if (!Number.isInteger(quantity) || quantity <= 0) {
        // Added validation mock (A.4)
        return HttpResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Quantity must be a positive integer.",
            },
          },
          { status: 400 }
        );
      }
      // Simplified success response
      return HttpResponse.json(mockCart);
    }
  ),
  http.delete(
    `${MEDUSA_BACKEND_URL}/store/carts/:cartId/line-items/:lineItemId`,
    ({ params }) => {
      if (params.cartId !== "cart_123")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Cart not found" } },
          { status: 404 }
        );
      if (params.lineItemId !== "item_1" && params.lineItemId !== "item_2")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Line item not found" } },
          { status: 404 }
        );
      // Simplified success response
      return HttpResponse.json(mockCart);
    }
  ),

  // --- Address Mocks (FE-048, FE-050) ---
  http.get(`${MEDUSA_BACKEND_URL}/store/customers/me`, ({ cookies }) => {
    if (cookies.connectsid === "mock-session-id")
      return HttpResponse.json(mockCustomer);
    return HttpResponse.json({ message: "Not authenticated" }, { status: 401 });
  }),
  http.post(
    `${MEDUSA_BACKEND_URL}/store/customers/me/addresses`,
    async ({ request, cookies }) => {
      if (cookies.connectsid !== "mock-session-id")
        return HttpResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      const addressData = await request.json();
      if (!addressData?.address_1 || !addressData?.city) {
        // Added validation mock (A.4)
        return HttpResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Missing required address fields.",
            },
          },
          { status: 400 }
        );
      }
      return HttpResponse.json(mockCustomer); // Simulate success by returning customer
    }
  ),
  http.post(
    `${MEDUSA_BACKEND_URL}/store/customers/me/addresses/:addressId`,
    async ({ request, cookies, params }) => {
      if (cookies.connectsid !== "mock-session-id")
        return HttpResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      const addressData = await request.json();
      if (!addressData?.address_1 || !addressData?.city) {
        // Added validation mock (A.4)
        return HttpResponse.json(
          {
            error: {
              code: "VALIDATION_ERROR",
              message: "Missing required address fields.",
            },
          },
          { status: 400 }
        );
      }
      if (params.addressId !== "addr_1" && params.addressId !== "addr_2")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Address not found" } },
          { status: 404 }
        );
      return HttpResponse.json(mockCustomer); // Simulate success
    }
  ),
  http.delete(
    `${MEDUSA_BACKEND_URL}/store/customers/me/addresses/:addressId`,
    ({ cookies, params }) => {
      if (cookies.connectsid !== "mock-session-id")
        return HttpResponse.json(
          { message: "Not authenticated" },
          { status: 401 }
        );
      if (params.addressId !== "addr_1" && params.addressId !== "addr_2")
        return HttpResponse.json(
          { error: { code: "NOT_FOUND", message: "Address not found" } },
          { status: 404 }
        );
      return HttpResponse.json(mockCustomer); // Simulate success
    }
  ),

  // --- Error Simulation Mocks ---
  http.get(`${MEDUSA_BACKEND_URL}/store/customers/me/error-401`, () =>
    HttpResponse.json(null, { status: 401 })
  ),
  http.get(`${MEDUSA_BACKEND_URL}/store/customers/me/error-403`, () =>
    HttpResponse.json(
      { error: { code: "FORBIDDEN", message: "Permission Denied Mock" } },
      { status: 403 }
    )
  ),
  http.get(`${MEDUSA_BACKEND_URL}/store/customers/me/error-500`, () =>
    HttpResponse.json(
      {
        error: { code: "INTERNAL_SERVER_ERROR", message: "Mock Server Error" },
      },
      { status: 500 }
    )
  ),
];
