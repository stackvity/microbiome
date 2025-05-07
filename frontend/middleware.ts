// File: frontend/middleware.ts
// Task IDs: Implied by Auth/RBAC needs (UM.4.1)
// Description: Next.js Edge Middleware for handling route protection based on authentication status and user role using NextAuth.js v5.
// Status: FIXED - Changed pattern to call auth() explicitly inside async middleware to resolve TS error and retrieve session.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth"; // IMPORT auth object from v5 setup

// --- Removed problematic import (no longer needed for this pattern) ---
// import { authOptions } from '@/lib/auth';

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
// Hardcode login path here. Ensure this path matches the one defined in authOptions.pages.signIn in lib/auth.ts
const REDIRECT_PATHS = {
  login: "/login", // HARDCODED - Ensure this matches lib/auth.ts authOptions.pages.signIn
  home: "/",
  customerDashboard: "/account/dashboard",
  vendorDashboard: "/vendor/dashboard",
  // adminDashboard: "/app-admin/dashboard",
};

// Export the middleware function directly and make it async
export async function middleware(request: NextRequest) {
  const session = await auth(); // Explicitly call auth() to get the session object
  const { pathname } = request.nextUrl;

  // 1. Allow NextAuth specific paths (these likely handle their own auth)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // 2. Allow public routes
  if (
    PUBLIC_ROUTES.some(
      (route) =>
        // Exact match or starts with for directory-like routes
        pathname === route ||
        (route !== "/" && pathname.startsWith(route + "/"))
    )
  ) {
    return NextResponse.next();
  }

  // 3. Explicitly redirect unauthenticated users trying to access non-public routes
  if (!session) {
    const loginUrl = new URL(REDIRECT_PATHS.login, request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    console.warn(
      `Middleware: Unauthenticated access attempt to ${pathname}. Redirecting to login.`
    );
    return NextResponse.redirect(loginUrl);
  }

  // 4. User is authenticated, check role-based access for protected routes
  // VERIFY (Rec A.1): Confirm `session.user.role` path matches the actual session structure from NextAuth callbacks (as defined in lib/auth.ts augmentation).
  const userRole = session.user?.role as string | undefined;
  const userId = session.user?.id; // Get user ID if available in session (Rec B.2)

  for (const prefix in PROTECTED_ROUTES) {
    // Use startsWith for broader path matching within a protected area
    if (pathname.startsWith(prefix)) {
      const requiredRoles =
        PROTECTED_ROUTES[prefix as keyof typeof PROTECTED_ROUTES];

      if (!userRole || !requiredRoles.includes(userRole)) {
        // User is authenticated but doesn't have the required role
        let redirectPath = REDIRECT_PATHS.home; // Default redirect to home if role mismatch
        if (userRole === "customer")
          redirectPath = REDIRECT_PATHS.customerDashboard;
        if (userRole === "vendor")
          redirectPath = REDIRECT_PATHS.vendorDashboard;
        // if (userRole === "admin") redirectPath = REDIRECT_PATHS.adminDashboard;

        console.warn(
          `Middleware: Unauthorized access attempt to ${pathname} by user ${
            userId ?? "Unknown"
          } with role ${userRole ?? "None"}. Required: ${requiredRoles.join(
            ", "
          )}. Redirecting to ${redirectPath}`
        );
        // Redirect to their default dashboard or home if no specific dashboard matches
        return NextResponse.redirect(new URL(redirectPath, request.url));
      }
      // User has the required role for this route prefix
      return NextResponse.next(); // Allow access
    }
  }

  // 5. If the route is not public and not explicitly protected with role checks,
  //    and the user is authenticated (which they must be to reach here), allow access.
  //    This covers authenticated routes without specific role requirements.
  return NextResponse.next();
}

// The config matcher remains the same
export const config = {
  matcher: [
    // Match all routes except internal Next.js paths, static files, and specific assets
    "/((?!api/|_next/static|_next/image|favicon.ico|images|sw.js).*)",
  ],
};
