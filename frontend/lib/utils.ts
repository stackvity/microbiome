// File: frontend/lib/utils.ts
// Task IDs: FE-018 (US-FE-011 - Core Utilities)
// Description: Central utility functions for the frontend application. Includes Tailwind class merging and basic formatting helpers.
// Status: Revised - Added more detailed JSDoc comments (Rec B.3) and note on dynamic currency (Rec A.4).

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally merges Tailwind CSS class values. It uses `clsx` to handle conditional
 * classes and `tailwind-merge` to intelligently merge Tailwind classes, resolving conflicts.
 * This is the standard utility provided by shadcn/ui.
 * Example: cn("p-4", { "bg-red-500": hasError }, "text-white")
 *
 * @param {...ClassValue} inputs - A list of class values. Can be strings, arrays, or objects
 *                                 where keys are class names and values are booleans.
 * @returns {string} The final merged class string.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a Date object, timestamp number, or date string into a locale-aware,
 * user-friendly date string based on the provided options.
 * Defaults to 'long' month, numeric day, and numeric year format (e.g., "January 1, 2024").
 * Handles potential invalid date inputs gracefully.
 *
 * @param {Date | number | string} dateInput - The date value to format. Can be a Date object,
 *                                             milliseconds since epoch, or a string parsable by `new Date()`.
 * @param {Intl.DateTimeFormatOptions} [options] - Optional configuration for `Intl.DateTimeFormat`.
 *                                                 Defaults to `{ year: "numeric", month: "long", day: "numeric" }`.
 * @returns {string} The formatted date string, or "Invalid Date" if the input cannot be parsed.
 */
export function formatDate(
  dateInput: Date | number | string,
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
): string {
  try {
    const date =
      typeof dateInput === "string" || typeof dateInput === "number"
        ? new Date(dateInput)
        : dateInput;
    // Check if the date is valid after parsing
    if (isNaN(date.getTime())) {
      console.warn("Invalid date input received in formatDate:", dateInput);
      return "Invalid Date";
    }
    // Assumes 'en-US' locale, adjust if internationalization is added
    return new Intl.DateTimeFormat("en-US", options).format(date);
  } catch (error) {
    console.error("Error formatting date:", dateInput, error);
    return "Invalid Date"; // Return fallback on unexpected formatting error
  }
}

/**
 * Formats a numeric amount into a locale-aware currency string.
 * **Crucially, assumes the input amount is in the smallest currency unit (e.g., cents for USD/EUR).**
 * Defaults to USD ($) if no currency code is provided.
 * Handles potential invalid inputs and unknown currency codes gracefully.
 * Example: formatCurrency(2999, 'USD') => "$29.99"
 *
 * @param {number} amount - The monetary amount in the smallest currency unit (e.g., cents).
 * @param {string} [currencyCode="USD"] - The 3-letter ISO 4217 currency code (case-insensitive). Defaults to 'USD'.
 *                                        **Note (Rec A.4):** Should be dynamically sourced based on context (e.g., user region, product price) in feature implementation.
 * @param {Intl.NumberFormatOptions} [options] - Optional configuration for `Intl.NumberFormat`.
 *                                                Defaults to `{ style: "currency", currency: currencyCode, minimumFractionDigits: 2 }`.
 * @returns {string} The formatted currency string (e.g., "$19.99", "€24.50"), "Invalid Amount" for non-numeric input, or a fallback format if the currency code is invalid.
 */
export function formatCurrency(
  amount: number,
  currencyCode: string = "USD",
  options: Intl.NumberFormatOptions = {
    style: "currency",
    currency: currencyCode, // Currency code is passed again here for clarity and potential overrides
    minimumFractionDigits: 2,
  }
): string {
  try {
    if (typeof amount !== "number" || isNaN(amount)) {
      console.warn("Invalid amount provided to formatCurrency:", amount);
      return "Invalid Amount";
    }

    // Convert from smallest unit (e.g., cents) to base unit.
    // This assumes standard 2 decimal places. Adjust logic if dealing with
    // currencies like JPY (0 decimals) or others with different subdivisions.
    const amountInBaseUnit = amount / 100;
    const upperCurrencyCode = currencyCode.toUpperCase();

    // Assumes 'en-US' locale, adjust if internationalization is added
    return new Intl.NumberFormat("en-US", {
      ...options,
      currency: upperCurrencyCode,
    }).format(amountInBaseUnit);
  } catch (error) {
    console.error("Error formatting currency:", amount, currencyCode, error);
    // Specifically handle RangeError which often indicates an invalid currency code
    if (error instanceof RangeError) {
      console.warn(
        `Invalid currency code "${currencyCode}" provided to formatCurrency. Falling back to basic format.`
      );
      // Fallback: Format as number with 2 decimal places and append the (potentially invalid) code
      const fallbackAmount = (amount / 100).toFixed(2);
      return `${fallbackAmount} ${currencyCode.toUpperCase()}`;
    }
    return "Invalid Currency"; // Generic fallback for other errors
  }
}

// Other utility functions can be added below...
