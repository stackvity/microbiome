// frontend/app/layout.tsx

import type { Metadata } from "next";
// Removed font imports as they are not strictly needed for "Hello World"
// Removed import "./globals.css"; <--- THE FIX

export const metadata: Metadata = {
  title: "Simple App", // Changed title for clarity
  description: "A very simple Next.js app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Removed font classNames from body for absolute minimum */}
      <body>{children}</body>
    </html>
  );
}
