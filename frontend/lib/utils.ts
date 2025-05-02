// File: frontend/lib/utils.ts
// --- START OF FILE ---
// Revision based on recommendations A.1, B.1, B.3.
// Includes essential 'cn' utility and basic formatters with minimal comments.

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes conditionally.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a date object into a localized string (e.g., "11/16/2024").
 * @param date - The date to format.
 * @param options - Optional Intl.DateTimeFormat options.
 * @returns Formatted date string.
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }
): string {
  try {
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date"; // Fallback for invalid date input
  }
}

/**
 * Formats a number (assumed to be in cents) into a currency string (e.g., "$29.99").
 * @param amount - The amount in the smallest currency unit (e.g., cents).
 * @param currency - The ISO 4217 currency code (defaults to 'USD').
 * @param options - Optional Intl.NumberFormat options.
 * @returns Formatted currency string.
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = "USD",
  options: Intl.NumberFormatOptions = {}
): string {
  if (amount == null) {
    return ""; // Handle null or undefined amount gracefully
  }
  try {
    // Divide by 100 to convert cents to the base currency unit
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      ...options,
    }).format(amount / 100);
  } catch (error) {
    console.error("Error formatting currency:", error);
    return "Invalid Amount"; // Fallback for errors
  }
}

// --- END OF FILE ---
