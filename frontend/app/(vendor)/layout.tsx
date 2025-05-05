// File: frontend/app/(vendor)/layout.tsx
// Task ID: FE-016 (Routing Layers - Vendor Layout)
// Description: Layout specific to vendor portal routes, includes Vendor Dashboard Sidebar/Header.
// Status: Revised (Added comment per B.1).

import React from "react";
// Specific layout component for the vendor dashboard (implementation expected from FE-BL-005)
import VendorDashboardLayout from "@/components/layout/VendorDashboardLayout";

/**
 * Layout component specifically for the Vendor Portal sections.
 * Wraps vendor pages with a vendor-specific layout including navigation.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component props including children vendor pages.
 */
export default function VendorPortalLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Utilizes the dedicated layout component for the vendor portal dashboard structure.
  return <VendorDashboardLayout>{children}</VendorDashboardLayout>;
}
