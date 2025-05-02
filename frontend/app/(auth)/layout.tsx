// File: frontend/app/(auth)/layout.tsx
// --- START OF FILE ---

import React from "react";

/**
 * Layout structure for authentication pages (Login, Register).
 * Rationale: Defines layout structure for authentication pages (Task ID: FE-016).
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Centers the authentication form content on the screen.
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center p-4"
      data-testid="auth-layout"
    >
      {/* Placeholder: Any potential Auth-specific header/logo could go here */}
      {children}
      {/* Placeholder: Any potential Auth-specific footer could go here */}
    </div>
  );
}

// --- END OF FILE ---
