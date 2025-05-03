// File: frontend/components/ui/spinner.tsx
// --- START OF FILE ---
// Custom Spinner component using lucide-react
// Task Ref: FE-031 (UI Component Library/Design System Layer)
// Revision based on Recommendation B.2 (JSDoc Expansion)

import * as React from "react";
import { Loader2 } from "lucide-react"; // Path verified
import { cn } from "@/lib/utils"; // Path verified

// Basic interface for Spinner props, extending SVG attributes.
export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  // No custom props needed for basic spinner. Size controlled via className.
}

/**
 * Renders an animated spinning loader icon (Loader2 from lucide-react).
 * Useful for indicating loading states within buttons or content areas.
 * Size and color can be controlled via Tailwind utility classes passed in `className`.
 * Recommendation A.2: Use visually hidden text or aria-label in the parent component
 * for accessibility when this spinner indicates a loading state.
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        // Applies Tailwind animation class and allows merging custom classes.
        className={cn("animate-spin", className)}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
// --- END OF FILE ---
