// File: frontend/middleware.ts
// Task IDs: Implied by Auth/RBAC needs (UM.4.1)
// Description: Next.js Edge Middleware for handling route protection based on authentication status and user role using NextAuth.js.
// Status: Revised - Added optional user ID logging on warn (Rec B.2). Added verification comments (Rec A.1, A.2).

import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// VERIFY (Rec A.2): Ensure these protected routes align with final folder structure and use cases.
const PROTECTED_ROUTES = {
  "/account": ["customer", "vendor", "admin"],
  "/account/dashboard": ["customer"],
  // Add specific Customer portal sub-routes here if they have different permissions
  "/vendor": ["vendor"],
  "/vendor/dashboard": ["vendor"],
  "/vendor/products": ["vendor"],
  "/vendor/orders": ["vendor"],
  "/vendor/payouts": ["vendor"],
  "/checkout": ["customer", "vendor", "admin"],
  // "/app-admin": ["admin"], // Example if FE admin pages existed
};

// Public routes accessible without authentication
const PUBLIC_ROUTES = ["/", "/products", "/login", "/register", "/api/auth"];

// Standard redirection targets
const REDIRECT_PATHS = {
  login: "/login",
  home: "/",
  customerDashboard: "/account/dashboard",
  vendorDashboard: "/vendor/dashboard",
  // adminDashboard: "/app-admin/dashboard",
};

export default withAuth(
  function middleware(request: NextRequestWithAuth) {
    const { pathname } = request.nextUrl;
    const token = request.nextauth.token;
    // VERIFY (Rec A.1): Confirm `token.role` path matches the actual session token structure from NextAuth callbacks.
    const userRole = token?.role as string | undefined;
    const userId = token?.sub; // Get user ID if available in token (Rec B.2)

    // Allow public routes
    if (
      PUBLIC_ROUTES.some(
        (route) =>
          pathname.startsWith(route) || pathname === route.replace(/\/$/, "")
      )
    ) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login
    if (!token) {
      const loginUrl = new URL(REDIRECT_PATHS.login, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check protected routes
    for (const prefix in PROTECTED_ROUTES) {
      if (pathname.startsWith(prefix)) {
        const requiredRoles =
          PROTECTED_ROUTES[prefix as keyof typeof PROTECTED_ROUTES];
        if (!userRole || !requiredRoles.includes(userRole)) {
          let redirectPath = REDIRECT_PATHS.login;
          if (userRole === "customer")
            redirectPath = REDIRECT_PATHS.customerDashboard;
          if (userRole === "vendor")
            redirectPath = REDIRECT_PATHS.vendorDashboard;
          // if (userRole === "admin") redirectPath = REDIRECT_PATHS.adminDashboard;

          // Log unauthorized access attempt, including user ID if available (Rec B.2)
          console.warn(
            `Middleware: Unauthorized access attempt to ${pathname} by user ${
              userId ?? "Unknown"
            } with role ${userRole ?? "None"}. Redirecting to ${redirectPath}`
          );
          return NextResponse.redirect(new URL(redirectPath, request.url));
        }
        // Allowed role, continue
        return NextResponse.next();
      }
    }

    // Default allow for authenticated users if route wasn't explicitly matched/denied above
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        // Public routes don't need token verification here
        if (
          PUBLIC_ROUTES.some(
            (route) =>
              pathname.startsWith(route) ||
              pathname === route.replace(/\/$/, "")
          )
        ) {
          return true;
        }
        // All other routes require a valid token to proceed to middleware function
        return !!token;
      },
    },
    pages: {
      signIn: REDIRECT_PATHS.login,
    },
  }
);

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico|images|sw.js).*)"],
};
