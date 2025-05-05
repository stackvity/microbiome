// File: frontend/app/(auth)/layout.tsx
// Task ID: FE-016 (Routing Layers - Auth Layout)
// Description: Layout specific to authentication routes (Login, Register), potentially simpler without main header/footer.
// Status: Revised (No code changes from baseline, aligns with FE-016).

import React from "react";

/**
 * Layout component for authentication-related pages (Login, Registration).
 * Provides a focused layout, potentially omitting standard Header/Footer.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component props including children pages.
 */
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Centered layout common for auth forms
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      {children}
    </div>
  );
}
