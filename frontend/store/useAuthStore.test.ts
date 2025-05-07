// File: frontend/store/useAuthStore.test.ts
// Rationale: Unit tests for the useAuthStore Zustand store.
// Task ID: FE-015-B (Part of EP-FE-003 US-FE-009)
// Status: Revised

import { act, renderHook } from "@testing-library/react";
import { useAuthStore } from "./useAuthStore";

describe("useAuthStore", () => {
  // Define the initial state structure for clarity and consistency in tests
  const initialAuthState = {
    isAuthenticated: false,
    userRole: null,
  };

  // Reset store to its initial state before each test
  beforeEach(() => {
    act(() => {
      useAuthStore.setState(initialAuthState);
    });
  });

  it("should have initial state as not authenticated and no user role", () => {
    const { result } = renderHook(() => useAuthStore());

    expect(result.current.isAuthenticated).toBe(
      initialAuthState.isAuthenticated
    );
    expect(result.current.userRole).toBe(initialAuthState.userRole);
  });

  it("setAuthState should update isAuthenticated and userRole correctly for customer", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "customer");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("customer");
  });

  it("setAuthState should update isAuthenticated and userRole correctly for vendor", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "vendor");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("vendor");
  });

  it("setAuthState should update isAuthenticated and userRole correctly for admin", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "admin");
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("admin");
  });

  it("setAuthState should set role to null when not authenticated", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "customer");
    });

    act(() => {
      result.current.setAuthState(false, null);
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userRole).toBeNull();
  });

  it("logout should reset isAuthenticated to false and userRole to null", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "admin");
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userRole).toBeNull();
  });

  it("calling setAuthState multiple times should reflect the latest state", () => {
    const { result } = renderHook(() => useAuthStore());

    act(() => {
      result.current.setAuthState(true, "customer");
    });
    expect(result.current.userRole).toBe("customer");

    act(() => {
      result.current.setAuthState(true, "vendor");
    });
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.userRole).toBe("vendor");

    act(() => {
      result.current.setAuthState(false, null);
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.userRole).toBeNull();
  });
});
