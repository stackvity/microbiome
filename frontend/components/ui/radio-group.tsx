// File: frontend/components/ui/radio-group.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Radio Group component implementation
// Task Ref: FE-028 (UI Component Library/Design System Layer)

"use client"; // Required for Radix UI client components

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react"; // Path verified

import { cn } from "@/lib/utils"; // Path verified

/**
 * Container component for a set of radio buttons, wrapping Radix UI's RadioGroup primitive.
 */
const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    // Applies default grid layout.
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * Individual radio button item component, wrapping Radix UI's RadioGroupItem primitive.
 */
const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>
>(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      // Applies base styles: size, shape, border, focus ring, disabled state.
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        // Centers the inner circle indicator.
        className="flex items-center justify-center"
      >
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
// --- END OF FILE ---
