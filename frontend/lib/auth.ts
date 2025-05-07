// File: frontend/lib/auth.ts
// Task IDs: Implied by FE-011, FE-015, FE-034
// Description: Centralized NextAuth.js configuration options.
// Status: FIXED - Refined augmentation again. **Requires deletion of conflicting augmentation in /lib/react-query/auth.ts**.

import type {
  User as NextAuthUser,
  Session as NextAuthSession,
  JWT as NextAuthJWT,
  // NextAuthConfig, // Keep commented out
} from "next-auth";
// import type { AdapterUser } from "next-auth/adapters";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import * as Sentry from "@sentry/nextjs";
import type { User } from "@/types/user";
// import api from "@/lib/api/axiosInstance";

// --- Reusable Types ---
interface AddressAugment {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string | null;
  city: string;
  postal_code: string;
  country_code: string;
  province?: string | null;
  phone?: string | null;
  company?: string | null;
  is_default_shipping?: boolean;
  is_default_billing?: boolean;
}

interface UserAugment {
  id: string;
  email: string;
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  role: "customer" | "vendor" | "admin";
  vendor_status?: "pending" | "approved" | "rejected" | null;
  stripe_connect_account_id?: string | null;
  shipping_addresses?: AddressAugment[];
}
// --- End Reusable Types ---

// Interface for the object returned by authorize
interface ExtendedNextAuthUser extends NextAuthUser {
  id: string;
  role?: UserAugment["role"] | null;
  vendor_status?: UserAugment["vendor_status"] | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  name?: string | null;
  image?: string | null;
}

/**
 * Configuration options for NextAuth.js.
 */
export const authOptions = {
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

        const backendUrl =
          process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
        const authEndpoint = "/store/auth"; // VERIFY

        try {
          const response = await fetch(backendUrl + authEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            let errorData = null;
            try {
              errorData = await response.json();
            } catch (e) {
              /* Ignore */
            }
            console.error(
              "Authorize Fetch Error Status:",
              response.status,
              errorData
            );
            if (response.status === 401) throw new Error("INVALID_CREDENTIALS");
            if (errorData?.error?.code === "VENDOR_NOT_APPROVED")
              throw new Error("VENDOR_PENDING");
            if (errorData?.error?.code === "VENDOR_REJECTED")
              throw new Error("VENDOR_REJECTED");
            throw new Error(`API Error: ${response.status}`);
          }

          const data: { customer: UserAugment } = await response.json();
          const user = data.customer;

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
            return {
              id: user.id,
              email: user.email,
              name: `${user.first_name || ""} ${user.last_name || ""}`.trim(),
              image: null, // Map image if available
              role: user.role,
              vendor_status: user.vendor_status,
              first_name: user.first_name,
              last_name: user.last_name,
            };
          } else {
            return null;
          }
        } catch (error: any) {
          if (
            [
              "VENDOR_PENDING",
              "VENDOR_REJECTED",
              "INVALID_CREDENTIALS",
            ].includes(error.message)
          ) {
            console.warn(
              `Authorize Warning: ${error.message} for email ${credentials.email}`
            );
            throw error;
          }
          console.error("Authorize Unexpected Error:", error);
          Sentry.captureException(error, {
            extra: {
              context: "NextAuth Authorize Credentials (fetch)",
              email: credentials.email,
            },
          });
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "database",
  },

  callbacks: {
    async jwt({
      token,
      user,
    }: {
      token: NextAuthJWT;
      user: NextAuthUser | null;
    }) {
      if (user) {
        // Use the augmented User type from declare module
        const augmentedUser = user as User;
        token.id = augmentedUser.id;
        token.role = augmentedUser.role;
        token.vendor_status = augmentedUser.vendor_status;
        // name & picture should be automatically added to token if User augmentation is correct
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: NextAuthSession;
      token: NextAuthJWT;
      user: NextAuthUser;
    }) {
      if (session?.user) {
        // Directly assign from augmented token type where possible
        session.user.id = token.id as string; // Ensure id is string
        session.user.role = token.role; // Role from augmented JWT
        session.user.vendor_status = token.vendor_status; // Vendor status from augmented JWT
        // Base fields should be present on augmented Session.user now
        session.user.name = token.name ?? session.user.name;
        session.user.image = token.picture ?? session.user.image; // JWT uses 'picture'
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET!,
};

// Type augmentation for NextAuth
// This block MUST be the single source of truth for augmenting these types.
// Ensure the conflicting block in `/lib/react-query/auth.ts` is DELETED.
declare module "next-auth" {
  interface Session {
    // Define the user property structure combining custom fields with NextAuthUser base fields
    user: {
      id: string; // Override to make id required and string
      role?: UserAugment["role"] | null;
      vendor_status?: UserAugment["vendor_status"] | null;
      // Include other fields from NextAuthUser that are needed
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }; // Removed the "&" intersection temporarily to simplify, relying on the properties listed
  }

  // Augment the core User model used internally by NextAuth
  interface User {
    id: string; // Override to make id required and string
    role?: UserAugment["role"] | null;
    vendor_status?: UserAugment["vendor_status"] | null;
    first_name?: string | null;
    last_name?: string | null;
    // Include other base fields from NextAuthUser if needed
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  // Augment JWT
  interface JWT {
    id?: string;
    role?: UserAugment["role"] | null;
    vendor_status?: UserAugment["vendor_status"] | null;
    // Explicitly declare base fields often added automatically
    name?: string | null;
    email?: string | null;
    picture?: string | null; // Standard JWT claim for profile picture
  }
}
