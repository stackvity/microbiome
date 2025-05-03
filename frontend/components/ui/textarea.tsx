// File: frontend/components/ui/textarea.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Textarea component implementation
// Task Ref: FE-027 (UI Component Library/Design System Layer)
// Revision based on Recommendation B.1 (Enhanced JSDoc).

import * as React from "react";

import { cn } from "@/lib/utils"; // Uses utility from FE-BL-003/US-FE-011

// Extends standard HTML textarea attributes. Provides consistent styling for multi-line text input fields.
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // No custom props added for the basic Textarea component in this revision.
}

// Textarea component implementation using forwardRef for ref handling.
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        // Apply base styles similar to Input, but with minimum height for multi-line text.
        // Uses CSS variables for theming consistency (border, ring, background, etc.).
        // Includes focus-visible and disabled states.
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className // Allows merging with custom classes provided externally.
        )}
        ref={ref} // Forward the ref to the underlying native textarea element.
        {...props} // Spread other native textarea props like value, onChange, rows, etc.
      />
    );
  }
);
// Set display name for easier debugging in React DevTools.
Textarea.displayName = "Textarea";

// Export the Textarea component for use.
export { Textarea };
// --- END OF FILE ---
