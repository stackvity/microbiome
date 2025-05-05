// File: frontend/app/(main)/layout.tsx
// Task ID: FE-016 (Routing Layers - Main Layout)
// Description: Layout for main application section accessed by logged-in/guest users, includes standard Header/Footer (via RootLayout).
// Status: Revised (No code changes from baseline, aligns with FE-016).

import React from "react";

/**
 * Layout component for the main application sections (Homepage, Products, Cart, Customer Account).
 * Relies on RootLayout for Header/Footer and simply renders children pages/layouts.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component props including children pages/layouts.
 */
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // RootLayout provides the persistent structure (Header, Footer, Providers).
  // This layer primarily exists for potential future main-section specific layouts.
  return <>{children}</>;
}
