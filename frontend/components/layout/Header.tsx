// File: frontend/components/layout/Header.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, User, Menu, Search } from "lucide-react"; // Added Search icon

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // TODO: Implement actual mobile menu display logic (e.g., Sheet/Drawer)
    console.log("Mobile menu toggle clicked, state:", !isMobileMenuOpen);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      data-testid="main-header"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Branding */}
        <div className="flex items-center">
          <Link
            href="/"
            className="flex items-center space-x-2"
            data-testid="branding-link"
          >
            {/* TODO: Replace with actual Logo component/SVG */}
            <span className="text-xl font-bold text-primary sm:text-2xl">
              Biomevity
            </span>
          </Link>
        </div>

        {/* Main Navigation (Desktop) */}
        <nav
          className="hidden flex-1 items-center justify-center space-x-6 md:flex"
          data-testid="main-navigation"
        >
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Products
          </Link>
          {/* Add other top-level navigation links like About, Blog, etc. */}
          {/* Example:
          <Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            About Us
          </Link>
          <Link href="/blog" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
            Blog
          </Link>
          */}
        </nav>

        {/* Header Actions */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Search Input (Desktop/Tablet) - Can be replaced with a Search Icon Button on mobile if full input is too wide */}
          <div className="hidden sm:block">
            {" "}
            {/* Hidden on extra small, shown on sm and up */}
            <input
              type="search"
              placeholder="Search products..."
              className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 sm:w-40 md:w-56 lg:w-64"
              data-testid="header-search-input"
            />
          </div>
          {/* Search Icon (Mobile) - Optionally triggers a search modal or navigates to a search page */}
          <div className="sm:hidden">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </div>

          {/* Auth Status */}
          <Link href="/login">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Login / Account"
              data-testid="header-auth-button"
            >
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Shopping Cart"
              className="relative"
              data-testid="header-cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {/* TODO: Add badge for item count from useCartStore */}
              {/* Example Badge:
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                3 
              </span>
              */}
            </Button>
          </Link>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Open menu"
              onClick={handleMobileMenuToggle}
              data-testid="mobile-menu-trigger"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* TODO: Implement Actual Mobile Menu (e.g., using shadcn/ui Sheet or custom drawer) */}
      {isMobileMenuOpen && (
        <div className="border-t border-border bg-background p-4 md:hidden">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/products"
              className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-primary"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Products
            </Link>
            {/* Add other mobile navigation links here */}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
