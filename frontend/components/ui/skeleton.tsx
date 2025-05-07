/*
-------------------------------------------------------------------------------
File: frontend/components/ui/skeleton.tsx
Description: Skeleton loading placeholder component based on shadcn/ui.
Task ID: FE-031 (Related to US-FE-016)
Status: Revised (No changes required based on analysis)
-------------------------------------------------------------------------------
*/
import { cn } from "@/lib/utils";

/**
 * Renders a skeleton placeholder typically used to indicate loading content.
 * Applies a pulsing animation and background color.
 * Accepts standard div attributes like className for customization (e.g., height, width, shape).
 * Example: `<Skeleton className="h-4 w-[250px]" />`
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
