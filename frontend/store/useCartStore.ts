// File: frontend/store/useCartStore.ts
// Task ID: FE-015
// Description: Zustand store slice for managing minimal global client-side cart state (e.g., item count and cart ID).
// Status: Revised - Added cartId property and setter.

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"; // Added persist

/**
 * Defines the structure of the minimal client-side cart state managed by Zustand.
 */
interface CartState {
  /** The number of distinct line items or total quantity in the cart, used for header indicators. */
  itemCount: number;
  /** The ID of the current active cart. Can be null if no cart is active or user is a guest with no cart. */
  cartId: string | null;
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
  /**
   * Sets the active cart ID.
   * @param {string | null} cartId - The ID of the active cart, or null if none.
   */
  setCartId: (cartId: string | null) => void;
}

/**
 * Zustand store for managing a minimal client-side representation of the cart,
 * including the item count and the active cart ID.
 * The cart ID is persisted to localStorage to maintain cart across sessions for guests.
 *
 * Note: The actual cart data (items, totals) should be managed via React Query
 * interacting with the backend Cart API. This store is for readily available
 * UI state. The count and cartId should be synchronized based on React Query data.
 */
export const useCartStore = create<CartState>()(
  devtools(
    persist(
      // Added persist middleware
      (set) => ({
        itemCount: 0,
        cartId: null, // Initialize cartId as null

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

        setCartId: (cartId) => set({ cartId }, false, "setCartId"), // Implement setCartId
      }),
      {
        name: "biomevity-cart-storage", // Name of the item in storage
        partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId
      }
    ),
    { name: "CartStore" } // Name for Redux DevTools extension
  )
);
