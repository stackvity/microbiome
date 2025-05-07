// File: frontend/components/layout/VendorDashboardLayout.tsx
// Task IDs: Implied by FE-016, FE-058
// Description: Specific layout structure for vendor portal pages. Includes sidebar navigation.
// Status: Revised based on analysis. Navigation items are placeholders.

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button"; // Example import
// TODO: Import actual icons from lucide-react
// import { LayoutDashboard, Package, ShoppingCart, DollarSign } from "lucide-react";

/**
 * Provides the layout structure for the vendor portal dashboard pages.
 * Includes a sidebar for navigation and a main content area.
 * Dynamic navigation links and active state styling to be implemented later.
 * @param {React.PropsWithChildren} props - Component props including children pages.
 * @see FE-BL-009 for feature integrations.
 */
const VendorDashboardLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  // TODO: Replace with dynamic navigation data, potentially fetched or configured
  const navItems = [
    {
      href: "/vendor/dashboard",
      label: "Dashboard" /* icon: LayoutDashboard */,
    },
    { href: "/vendor/products", label: "Products" /* icon: Package */ },
    { href: "/vendor/orders", label: "Orders" /* icon: ShoppingCart */ },
    { href: "/vendor/payouts", label: "Payouts" /* icon: DollarSign */ },
  ];

  return (
    <div className="grid min-h-[calc(100vh-theme(spacing.14))] md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar Navigation */}
      <aside
        className="hidden border-r bg-muted/40 md:block"
        data-testid="dashboard-sidebar"
      >
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-[60px] items-center border-b px-6">
            {/* TODO: Consider adding vendor logo/name here */}
            <Link
              href="/vendor/dashboard"
              className="flex items-center gap-2 font-semibold"
            >
              <span className="">Vendor Portal</span>
            </Link>
          </div>
          <nav
            className="flex-1 overflow-auto py-4 px-4 text-sm font-medium"
            data-testid="dashboard-navigation"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                // TODO: Implement active state styling based on current route (e.g., using usePathname hook)
              >
                {/* TODO: Add actual Lucide icon component: <item.icon className="h-4 w-4" /> */}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main
        className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6"
        data-testid="dashboard-main-content"
      >
        {/* TODO: Implement Mobile Header/Menu trigger and Sheet/Drawer component */}
        {children}
      </main>
    </div>
  );
};

export default VendorDashboardLayout;
