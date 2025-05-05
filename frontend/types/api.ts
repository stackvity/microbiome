// File: frontend/types/api.ts
// Task ID: FE-018 (US-FE-011 - Core Utilities & Types)
// Description: Defines common types for API interactions, like error responses and pagination.
// Status: Revised - Added more specific JSDoc comments. Confirmed details structure.

/**
 * Standard structure for API error responses.
 * Note: Verify against `api-contract.md` common error schema.
 */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any | null; // Structure varies, use `ApiValidationErrorResponse` for specific cases
    trace_id?: string | null;
  };
}

/**
 * Represents a generic field validation error detail, often used in `details` array.
 */
export interface FieldValidationError {
  field: string;
  message: string;
}

/**
 * Structure for API error responses specifically for validation failures.
 * Note: Confirms structure expected for `details` field based on prior analysis.
 */
export interface ApiValidationErrorResponse extends ApiErrorResponse {
  error: {
    code: "VALIDATION_ERROR" | "BAD_REQUEST" | string; // Allow standard and other codes
    message: string;
    details?: FieldValidationError[] | null; // Array of field-specific errors
    trace_id?: string | null;
  };
}

/**
 * Generic structure for paginated API list responses.
 * Note: Uses generic type `T` for list items. Verify field names (`items`, `limit`, `offset`, `count`) against actual Medusa API responses.
 */
export interface PaginatedResponse<T> {
  items: T[];
  limit: number;
  offset: number;
  count: number; // Total count across all pages
}
