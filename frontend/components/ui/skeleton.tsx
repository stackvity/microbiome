// File: frontend/components/ui/skeleton.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Skeleton component implementation
// Task Ref: FE-031 (UI Component Library/Design System Layer)
// Revision based on Recommendation B.2 (JSDoc Expansion)

import { cn } from "@/lib/utils"; // Path verified

/**
 * Displays a placeholder preview of your content before the data gets loaded,
 * improving the user experience during loading states.
 * Applies a pulsing animation and muted background color.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    // Applies base styles: background color, animation pulse, rounded corners.
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
// --- END OF FILE ---
