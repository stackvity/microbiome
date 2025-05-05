// File: frontend/store/useCartStore.ts
// Task ID: FE-015
// Description: Zustand store slice for managing minimal global client-side cart state (e.g., item count for header indicator).
// Status: Revised (Applying B.1 - Added detailed JSDoc comments).

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/**
 * Defines the structure of the minimal client-side cart state managed by Zustand.
 */
interface CartState {
  /** The number of distinct line items or total quantity in the cart, used for header indicators. */
  itemCount: number;
  /**
   * Sets the item count directly. Ensures count is non-negative.
   * @param {number} count - The new item count.
   */
  setItemCount: (count: number) => void;
  /** Increments the item count by one. */
  incrementItemCount: () => void;
  /** Decrements the item count by one, ensuring it doesn't go below zero. */
  decrementItemCount: () => void;
  /** Resets the item count to zero. */
  resetItemCount: () => void;
}

/**
 * Zustand store for managing a minimal client-side representation of the cart,
 * primarily the item count for UI elements like the header indicator.
 *
 * Note: The actual cart data (items, totals) should be managed via React Query
 * interacting with the backend Cart API. This store is just for readily available
 * UI state like the count. The count should be synchronized based on React Query data
 * (e.g., using an effect in a component that fetches the cart).
 */
export const useCartStore = create<CartState>()(
  devtools(
    (set) => ({
      itemCount: 0,

      setItemCount: (count) =>
        set({ itemCount: count >= 0 ? count : 0 }, false, "setItemCount"),

      incrementItemCount: () =>
        set(
          (state) => ({ itemCount: state.itemCount + 1 }),
          false,
          "incrementItemCount"
        ),

      decrementItemCount: () =>
        set(
          (state) => ({ itemCount: Math.max(0, state.itemCount - 1) }),
          false,
          "decrementItemCount"
        ),

      resetItemCount: () => set({ itemCount: 0 }, false, "resetItemCount"),
    }),
    { name: "CartStore" } // Name for Redux DevTools extension
  )
);
