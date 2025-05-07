// File: frontend/auth.ts
// Description: Central NextAuth.js v5 configuration and export.
// Imports authOptions from lib/auth.ts and exports the handlers.
// Status: FIXED - Applying 'as any' cast workaround for persistent TS2349.

// Import the entire module namespace
import * as NextAuthModule from "next-auth";
// Use relative path for potentially more reliable resolution from root
import { authOptions } from "./lib/auth"; // Import the options object

// --- Workaround for persistent TS2349 ---
// Explicitly access the 'default' export from the module namespace.
// Cast to 'any' to bypass the type checker's inability to resolve the call signature here.
// This assumes the default export *is* the callable NextAuth function,
// which is the standard convention for NextAuth v5.
const NextAuth = (NextAuthModule as any).default;
// -----------------------------------------

// Initialize NextAuth.js v5 with the defined options
// Export the handlers, signIn, signOut, and auth functions/object
export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);

// Note: Depending on specific usage (e.g., Edge compatibility for middleware),
// you might need separate configurations or ensure authOptions are Edge-compatible.
// For MVP, this standard setup is usually sufficient.
