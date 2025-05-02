// File: frontend/store/useAuthStore.ts
// --- START OF FILE ---

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Represents the state structure for authentication.
 */
interface AuthState {
  isAuthenticated: boolean;
  // user: User | null; // Example: Add user details later if needed client-side. (Recommendation B.2)
}

/**
 * Represents the actions available to modify the authentication state.
 */
interface AuthActions {
  login: () => void;
  logout: () => void;
  // setUser: (user: User | null) => void; // Example for later expansion
}

/**
 * Zustand store for managing basic client-side authentication state.
 * Provides state (isAuthenticated) and actions (login, logout).
 * Rationale (FE-015): Centralizes client-side auth state logic.
 * Rationale (Recommendation B.1): JSDoc added for clarity.
 */
const useAuthStore = create<AuthState & AuthActions>()(
  devtools(
    (set) => ({
      // Initial state
      isAuthenticated: false, // Default to not authenticated
      // user: null,

      // Actions
      login: () => set({ isAuthenticated: true }, false, "auth/login"),
      logout: () => set({ isAuthenticated: false }, false, "auth/logout"),
      // setUser: (user) => set({ user }, false, 'auth/setUser'),
    }),
    {
      name: "AuthStore", // Name for Redux DevTools
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export default useAuthStore;

// --- END OF FILE ---
