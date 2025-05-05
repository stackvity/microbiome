// File: frontend/lib/auth.ts
// Task IDs: Implied by FE-011, FE-015, FE-034
// Description: Centralized NextAuth.js configuration options.
// Status: Revised based on analysis findings (Recommendations A.1, A.2, A.3, B.3). Uses Sentry logging, removed commented adapter, added JSDoc, added comment for BE response verification.

import type { AuthOptions, User as NextAuthUser } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as Sentry from "@sentry/nextjs"; // Import Sentry
import { User } from "@/types/user";
import api from "@/lib/api/axiosInstance";

// Extend NextAuthUser to include properties from custom User type
interface ExtendedNextAuthUser extends NextAuthUser {
  id: string; // Ensure 'id' is always present and a string
  role?: User["role"] | null;
  vendor_status?: User["vendor_status"] | null;
  // Add other required properties if needed by session/token
  first_name?: string | null;
  last_name?: string | null;
}

/**
 * Configuration options for NextAuth.js.
 * Defines authentication providers, session strategy, callbacks, and custom pages.
 */
export const authOptions: AuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "test@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<ExtendedNextAuthUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Note (A.3): Verify this endpoint path and the nested response structure
          // (`{ customer: { ... } }`) against the actual Medusa backend implementation/AUT-API-002.md.
          const response = await api.post<{ customer: User }>("/store/auth", {
            email: credentials.email,
            password: credentials.password,
          });

          const user = response.data.customer;

          if (user && user.role === "vendor") {
            if (user.vendor_status !== "approved") {
              throw new Error(
                user.vendor_status === "pending"
                  ? "VENDOR_PENDING"
                  : "VENDOR_REJECTED"
              );
            }
          }

          if (user) {
            // Ensure the returned object shape matches ExtendedNextAuthUser
            return {
              id: user.id,
              email: user.email,
              name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
              image: null,
              role: user.role,
              vendor_status: user.vendor_status,
              // Explicitly add first_name and last_name if needed by the session
              first_name: user.first_name,
              last_name: user.last_name,
            };
          } else {
            return null; // Indicate failed authentication
          }
        } catch (error: any) {
          // Handle specific errors thrown above
          if (
            error.message === "VENDOR_PENDING" ||
            error.message === "VENDOR_REJECTED"
          ) {
            throw error; // Re-throw for NextAuth to handle
          }

          // Log other API errors to Sentry (Recommendation A.1)
          Sentry.captureException(error, {
            extra: {
              context: "NextAuth Authorize Credentials",
              email: credentials.email,
            },
          });
          // Return null to signify authorization failure for credentials
          return null;
        }
      },
    }),
  ],

  // Use database sessions for persistence and control
  session: {
    strategy: "database",
  },

  // Database Adapter removed as per Recommendation A.2 (assuming NextAuth handles internally or adapter setup is elsewhere)

  // Callbacks customize session/token data
  callbacks: {
    async jwt({ token, user }) {
      // Persist extra user info from authorize/profile into the token (for JWT strategy mainly, but good practice)
      if (user) {
        const extendedUser = user as ExtendedNextAuthUser;
        token.id = extendedUser.id;
        token.role = extendedUser.role;
        token.vendor_status = extendedUser.vendor_status;
        token.name = extendedUser.name; // Ensure name is passed through
        token.picture = extendedUser.image; // Ensure image is passed through
      }
      return token;
    },
    async session({ session, token, user }) {
      // Add custom properties to the session object accessible client-side
      // Source data from token (if JWT) or user (if DB strategy)
      if (session?.user) {
        // Use token fields preferentially if available (covers both strategies)
        session.user.id = (token?.id as string) ?? user?.id;
        session.user.role =
          (token?.role as User["role"] | null) ??
          (user as ExtendedNextAuthUser)?.role;
        session.user.vendor_status =
          (token?.vendor_status as User["vendor_status"] | null) ??
          (user as ExtendedNextAuthUser)?.vendor_status;
        // Ensure standard fields are also present if modified
        session.user.name = token?.name ?? user?.name;
        session.user.image = token?.picture ?? user?.image;
      }
      return session;
    },
  },

  // Custom pages for auth actions
  pages: {
    signIn: "/login",
    // Add other pages like error or verifyRequest if needed
  },

  // Secret used to sign tokens/cookies
  secret: process.env.NEXTAUTH_SECRET!,

  // Optional: Enable debug logs in development
  // debug: process.env.NODE_ENV === 'development',
};

// Type augmentation for the session user to include custom properties
// This should align with the data added in the session callback
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Ensure ID is always available
      role?: User["role"] | null;
      vendor_status?: User["vendor_status"] | null;
    } & NextAuthUser; // Include default fields like name, email, image
  }

  // Augment the User type used internally by NextAuth if needed (e.g., in callbacks)
  interface User extends NextAuthUser {
    id: string; // Ensure id is always string
    role?: User["role"] | null;
    vendor_status?: User["vendor_status"] | null;
    first_name?: string | null; // Add fields from Medusa if available
    last_name?: string | null;
  }
}

// Type augmentation for JWT to include custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: User["role"] | null;
    vendor_status?: User["vendor_status"] | null;
  }
}
