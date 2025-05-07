// File: frontend/components/layout/Footer.tsx
// Task IDs: Implied by FE-016, FE-051
// Description: Main application footer component. Includes copyright, links, etc.
// Status: Revised based on analysis. Links are placeholders.

import * as React from "react";
import Link from "next/link";

/**
 * Renders the main site footer.
 * Contains copyright information and placeholder navigation links.
 */
const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background" data-testid="main-footer">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Biomevity Marketplace. All rights reserved.
          </p>

          {/* Footer Links (Placeholder) */}
          {/* TODO: Update hrefs to actual page paths */}
          <nav className="flex space-x-4" data-testid="footer-navigation">
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
