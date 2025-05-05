// File: frontend/store/useAuthStore.ts
// Task ID: FE-015
// Description: Zustand store slice for managing minimal global client-side authentication state.
// Status: Revised (Applying B.1 - Added detailed JSDoc comments).

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Defines the structure of the authentication state managed by Zustand.
 */
interface AuthState {
  /** Whether the user is currently authenticated according to client-side knowledge. */
  isAuthenticated: boolean;
  /** The role of the authenticated user, used for client-side UI decisions. */
  userRole: "customer" | "vendor" | "admin" | null;
  /**
   * Updates the authentication state.
   * @param {boolean} isAuthenticated - The new authentication status.
   * @param {AuthState['userRole']} role - The role of the user if authenticated, otherwise null.
   */
  setAuthState: (isAuthenticated: boolean, role: AuthState["userRole"]) => void;
  /** Resets the authentication state to its initial logged-out values. */
  logout: () => void;
}

/**
 * Zustand store for managing basic client-side authentication state.
 * Provides state for isAuthenticated and userRole, along with actions to update them.
 *
 * Note: This client-side state should complement, not replace, server-side session
 * management handled by NextAuth.js. It's primarily for UI reactivity and immediate
 * conditional rendering based on auth status, potentially synchronized with NextAuth's `useSession`.
 */
export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      userRole: null,

      setAuthState: (isAuthenticated, role) =>
        set({ isAuthenticated, userRole: role }, false, "setAuthState"),

      logout: () =>
        set({ isAuthenticated: false, userRole: null }, false, "logout"),
    }),
    { name: "AuthStore" } // Name for Redux DevTools extension
  )
);
