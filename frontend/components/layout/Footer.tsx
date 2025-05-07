// File: frontend/components/layout/Footer.tsx
import * as React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="border-t border-border bg-background text-muted-foreground"
      data-testid="main-footer"
    >
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Consistent padding with header */}
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-between sm:text-left">
          {/* Copyright */}
          <p className="text-sm">
            © {currentYear} Biomevity Marketplace. All rights reserved.
          </p>

          {/* Footer Links */}
          <nav
            className="flex flex-wrap justify-center gap-x-6 gap-y-2 sm:justify-end"
            data-testid="footer-navigation"
          >
            <Link
              href="/terms-of-service" // TODO: Update to actual paths
              className="text-sm hover:text-primary hover:underline"
            >
              Terms
            </Link>
            <Link
              href="/privacy-policy" // TODO: Update to actual paths
              className="text-sm hover:text-primary hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="/contact" // TODO: Update to actual paths
              className="text-sm hover:text-primary hover:underline"
            >
              Contact
            </Link>
            {/* Add other footer links as needed */}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
