// File: frontend/app/layout.tsx
// Task IDs: FE-014 (React Query Provider), FE-016 (Routing Layers), FE-051 (Header/Footer), FE-052 (Error Boundary implied), FE-053 (Not Found implied), FE-001 (TS/Tailwind setup), FE-005-R (Global Styles), FE-015 (Zustand implied usage)
// Description: Root application layout applying global structure (Header/Footer), Providers (ReactQueryProvider, NextAuth SessionProvider), global styles, and root metadata. Using Sonner for toasts.
// Status: Revised - Applied optional recommendation B.1 (JSDoc for metadata). Refined for layout tidiness.

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css"; // Apply global styles defined via FE-005-R - Path assumes app/global.css
import ReactQueryProvider from "@/lib/react-query/ReactQueryProvider"; // RQ Provider setup via FE-014
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"; // Added for FE-014 AC
import { SessionProvider } from "next-auth/react"; // Needed for client-side session access
// Note: Zustand store access (FE-015) typically handled via direct hook imports, no specific Provider needed here unless complex SSR hydration is implemented.
import Header from "@/components/layout/Header"; // Header component implementation expected from FE-BL-005
import Footer from "@/components/layout/Footer"; // Footer component implementation expected from FE-BL-005
import { Toaster as SonnerToaster } from "sonner"; // IMPORT Sonner Toaster directly

const inter = Inter({ subsets: ["latin"] });

/**
 * Defines the default metadata for the application, including title template and description.
 * This is used by Next.js to populate HTML head tags.
 */
export const metadata: Metadata = {
  title: {
    template: "%s | Biomevity Marketplace",
    default: "Biomevity Marketplace",
  },
  description:
    "Curated marketplace for microbiome health products and insights.",
};

/**
 * Root layout component for the entire application.
 * Sets up global styles, fonts, context providers (React Query, NextAuth),
 * and the main page structure (Header, Main Content, Footer). Includes Sonner for toasts.
 * @param {Readonly<{ children: React.ReactNode }>} props - Component props including children pages/layouts.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {" "}
      {/* Optional: add scroll-smooth */}
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-background text-foreground antialiased`}
      >
        {" "}
        {/* Added antialiased and ensured bg/text colors are applied */}
        {/* Provides session context from NextAuth.js */}
        <SessionProvider>
          {/* Provides the QueryClient for TanStack Query */}
          <ReactQueryProvider>
            {/* Header component defined in FE-BL-005 */}
            <Header />
            {/* Main application content */}
            <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
              {" "}
              {/* Consistent padding with Header/Footer */}
              {children}
            </main>
            {/* Footer component defined in FE-BL-005 */}
            <Footer />
            {/* Global component for displaying Sonner toast notifications */}
            <SonnerToaster richColors position="top-right" />
            {/* Conditionally render React Query DevTools only in development */}
            {process.env.NODE_ENV === "development" && (
              <ReactQueryDevtools initialIsOpen={false} />
            )}
          </ReactQueryProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
