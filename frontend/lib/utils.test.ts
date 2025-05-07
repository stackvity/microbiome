// File: frontend/lib/utils.test.ts
// Rationale: Unit tests for utility functions like formatDate and formatCurrency.
// Task ID: FE-050-B (Part of FE-BL-007 US-FE-011)
// Status: Revised - Standardized date string input for formatDate tests. Added edge case for formatCurrency.

import { formatDate, formatCurrency, cn } from "./utils";

describe("Utility Functions", () => {
  describe("cn", () => {
    it("should merge class names correctly", () => {
      expect(cn("bg-red-500", "text-white")).toBe("bg-red-500 text-white");
    });

    it("should handle conditional class names", () => {
      expect(cn("base", { "conditional-class": true })).toBe(
        "base conditional-class"
      );
      expect(cn("base", { "conditional-class": false })).toBe("base");
    });

    it("should merge conflicting tailwind classes correctly", () => {
      expect(cn("p-4", "p-2")).toBe("p-2");
      expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
    });

    it("should handle various input types", () => {
      expect(cn("foo", undefined, "bar", null, { baz: true, bat: false })).toBe(
        "foo bar baz"
      );
    });
  });

  describe("formatDate", () => {
    it("should format a Date object correctly with default options", () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDate(date)).toBe("January 15, 2024");
    });

    it("should format a timestamp correctly with default options", () => {
      const timestamp = new Date(2023, 11, 25).getTime(); // December 25, 2023
      expect(formatDate(timestamp)).toBe("December 25, 2023");
    });

    it("should format an ISO 8601 date string correctly with default options", () => {
      expect(formatDate("2022-10-05T00:00:00.000Z")).toBe("October 5, 2022");
    });

    it("should format with custom options (e.g., short date)", () => {
      const date = new Date(2024, 0, 15);
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      expect(formatDate(date, options)).toBe("Jan 15, 2024");
    });

    it("should format with custom options (e.g., date and time)", () => {
      const date = new Date(2024, 0, 15, 14, 30, 0); // Jan 15, 2024, 2:30 PM
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      };
      expect(formatDate(date, options)).toMatch(
        /January 15, 2024, (2:30 PM|2:30 p.m.)/
      );
    });

    it('should return "Invalid Date" for an invalid date string input', () => {
      expect(formatDate("not-a-date-string")).toBe("Invalid Date");
    });

    it('should return "Invalid Date" for NaN timestamp input', () => {
      expect(formatDate(NaN)).toBe("Invalid Date");
    });

    it("should handle different timezones consistently (displays in local time of test runner for default)", () => {
      const dateUTC = new Date(Date.UTC(2024, 0, 15, 10, 0, 0));
      const localFormatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(dateUTC);
      expect(formatDate(dateUTC)).toBe(localFormatted);
    });
  });

  describe("formatCurrency", () => {
    it("should format an amount in USD correctly (default)", () => {
      expect(formatCurrency(2999)).toBe("$29.99");
    });

    it("should format an amount in EUR correctly", () => {
      expect(formatCurrency(5000, "EUR")).toBe("€50.00");
    });

    it("should format an amount in JPY correctly (no decimals for JPY)", () => {
      expect(formatCurrency(150000, "JPY")).toBe("¥1,500");
    });

    it("should format zero amount correctly", () => {
      expect(formatCurrency(0, "USD")).toBe("$0.00");
    });

    it("should format single smallest unit correctly", () => {
      expect(formatCurrency(1, "USD")).toBe("$0.01");
    });

    it("should format with custom options (e.g., no currency symbol)", () => {
      const options: Intl.NumberFormatOptions = {
        style: "decimal",
        minimumFractionDigits: 2,
      };
      expect(formatCurrency(12345, "USD", options)).toBe("123.45");
    });

    it('should return "Invalid Amount" for non-numeric input', () => {
      // @ts-expect-error Testing invalid input type
      expect(formatCurrency("not-a-number")).toBe("Invalid Amount");
    });

    it('should return "Invalid Amount" for NaN input', () => {
      expect(formatCurrency(NaN)).toBe("Invalid Amount");
    });

    it("should handle unknown currency code by formatting as number and appending code", () => {
      expect(formatCurrency(12345, "XYZ")).toBe("123.45 XYZ");
    });

    it("should handle amounts that result in less than a dollar", () => {
      expect(formatCurrency(50, "USD")).toBe("$0.50");
    });

    it("should handle large amounts correctly", () => {
      expect(formatCurrency(123456789, "USD")).toBe("$1,234,567.89");
    });
  });
});
