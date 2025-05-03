// File: frontend/components/ui/button.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Button component implementation
// Task Ref: FE-026 (UI Component Library/Design System Layer)
// Revision based on Recommendation B.1 (Enhanced JSDoc).

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Uses utility from FE-BL-003/US-FE-011

// Defines reusable button styles with variants for appearance and size.
// Leverages Tailwind CSS and CSS variables defined in globals.css for theming.
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90", // Standard primary action
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90", // For actions that delete data or are potentially dangerous
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80", // Less prominent actions
        ghost: "hover:bg-accent hover:text-accent-foreground", // Minimal styling, often for tertiary actions or within other components
        link: "text-primary underline-offset-4 hover:underline", // Styled as a hyperlink
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground", // Transparent background with border
      },
      size: {
        default: "h-10 px-4 py-2", // Standard size
        sm: "h-9 rounded-md px-3", // Smaller size
        lg: "h-11 rounded-md px-8", // Larger size
        icon: "h-10 w-10", // Square size for icon-only buttons
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Extends standard HTML button attributes and incorporates variants defined by cva.
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, the button will render as a child component (e.g., wrapping a Link),
   * merging properties and behavior. Useful for creating accessible links styled as buttons.
   * @default false
   */
  asChild?: boolean;
}

// Button component implementation using forwardRef for ref handling.
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    // Determine the underlying component based on asChild prop.
    const Comp = asChild ? Slot : "button";
    return (
      // Apply computed variant/size classes and merge with any additional className.
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
// Set display name for easier debugging in React DevTools.
Button.displayName = "Button";

// Export the component and its variants for use.
export { Button, buttonVariants };
// --- END OF FILE ---
