// File: frontend/components/ui/tabs.tsx
// --- START OF FILE ---
// Sourced from shadcn/ui Tabs component implementation
// Task Ref: FE-030 (UI Component Library/Design System Layer)
// Revision based on Recommendations B.1 (E2E Testability) & B.2 (JSDoc Expansion)

"use client"; // Required for Radix UI client components

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils"; // Path verified

/**
 * Root component for a set of tabs, containing the list and content panels.
 */
const Tabs = TabsPrimitive.Root;

/**
 * Container component holding the list of tab triggers (`TabsTrigger`).
 */
const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

/**
 * An interactive element that activates its associated `TabsContent` panel when clicked.
 */
const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
    "data-testid"?: string; // Optional prop for testability
  }
>(({ className, "data-testid": dataTestId, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    data-testid={dataTestId}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

/**
 * Contains the content associated with a specific tab trigger. Displayed when the trigger is active.
 */
const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
// --- END OF FILE ---
