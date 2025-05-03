// File: frontend/components/ui/label.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Label component implementation
// Task Ref: FE-027 (UI Component Library/Design System Layer)

"use client"; // Required for Radix UI component usage

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils"; // Path verified

// Defines base styles for the label element.
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Accessible label component wrapping Radix UI's Label primitive.
 * Provides enhanced accessibility for form elements.
 */
const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> &
    VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
// --- END OF FILE ---
