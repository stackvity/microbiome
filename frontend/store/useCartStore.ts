// File: frontend/store/useCartStore.ts
// --- START OF FILE ---

import { create } from "zustand";
import { devtools } from "zustand/middleware";
// Note: No direct 'persist' middleware added initially per US-FE-009 baseline. (Recommendation B.3)
// Consider adding `persist` later if client-side itemCount persistence across sessions is desired before full cart load.
// Cart data itself is primarily server-state managed by React Query.

/**
 * Represents the state structure for basic cart information (item count).
 */
interface CartState {
  itemCount: number;
}

/**
 * Represents the actions available to modify the basic cart state.
 */
interface CartActions {
  setItemCount: (count: number) => void;
  incrementItemCount: () => void;
  decrementItemCount: () => void;
  resetItemCount: () => void;
}

/**
 * Zustand store for managing basic client-side cart state like item count.
 * Used primarily for UI elements like header indicators needing quick access.
 * Rationale (FE-015): Provides efficient access to frequently needed cart summary data.
 * Rationale (Recommendation B.1): JSDoc added for clarity.
 */
const useCartStore = create<CartState & CartActions>()(
  devtools(
    (set) => ({
      // Initial state
      itemCount: 0,

      // Actions
      setItemCount: (count) =>
        set({ itemCount: Math.max(0, count) }, false, "cart/setItemCount"),

      incrementItemCount: () =>
        set(
          (state) => ({ itemCount: state.itemCount + 1 }),
          false,
          "cart/increment"
        ),

      decrementItemCount: () =>
        set(
          (state) => ({ itemCount: Math.max(0, state.itemCount - 1) }),
          false,
          "cart/decrement"
        ),

      resetItemCount: () => set({ itemCount: 0 }, false, "cart/reset"),
    }),
    {
      name: "CartStore", // Name for Redux DevTools
      enabled: process.env.NODE_ENV === "development",
    }
  )
);

export default useCartStore;

// --- END OF FILE ---
