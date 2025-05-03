// File: frontend/components/ui/input.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Input component implementation
// Task Ref: FE-027 (UI Component Library/Design System Layer)
// Revision based on Recommendation B.1 (Enhanced JSDoc).

import * as React from "react";

import { cn } from "@/lib/utils"; // Uses utility from FE-BL-003/US-FE-011

// Extends standard HTML input attributes. Provides consistent styling for input fields.
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // No custom props added for the basic Input component in this revision.
}

// Input component implementation using forwardRef for ref handling.
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        // Apply base styles for inputs, consistent with the design system.
        // Includes styles for default state, focus state (using ring variables),
        // placeholder text, file input button styling, and disabled state.
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className // Allows merging with custom classes provided externally.
        )}
        ref={ref} // Forward the ref to the underlying native input element.
        {...props} // Spread other native input props like value, onChange, etc.
      />
    );
  }
);
// Set display name for easier debugging in React DevTools.
Input.displayName = "Input";

// Export the Input component for use.
export { Input };
// --- END OF FILE ---
