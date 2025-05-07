/*
-------------------------------------------------------------------------------
File: frontend/components/ui/spinner.tsx
Description: Custom reusable loading spinner component using lucide-react.
Task ID: FE-031 (Related to US-FE-016)
Status: Revised (Added JSDoc comment, verified className usage)
-------------------------------------------------------------------------------
*/
import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  // Inherits standard SVG attributes like className, etc.
}

/**
 * Renders a simple loading spinner icon using lucide-react's Loader2 icon
 * with a spinning animation applied via Tailwind CSS classes.
 * Accepts standard SVG attributes for customization (e.g., className for size).
 * Example: `<Spinner className="h-8 w-8 text-primary" />`
 */
const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn("animate-spin", className)} // Apply spin animation and allow overriding
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export { Spinner };
