// File: frontend/lib/api/axiosInstance.ts
// Task IDs: FE-010, FE-011, FE-012, FE-024
// Status: Revised based on recommendations. Assumes HttpOnly cookie authentication.

import axios, { AxiosError } from "axios";
import * as Sentry from "@sentry/nextjs";
// import { signOut } from 'next-auth/react'; // Import would be needed higher up if called directly
// import { toast } from 'react-hot-toast'; // Import would be needed higher up if called directly
// import { getErrorMessageFromCode } from '@/lib/errorMapping'; // Example import for B.1

// Define a type for the structured error added to AxiosError instances
interface StructuredError {
  code: string;
  message: string;
  status: number | null;
  details?: any;
}

// Extend AxiosError interface to include our custom structured error
declare module "axios" {
  export interface AxiosError {
    structuredError?: StructuredError;
  }
}

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Using HttpOnly session cookies for authentication (verified assumption A.1)
  withCredentials: true,
  timeout: 15000, // 15 seconds
});

// Request interceptor (primarily for logging or adding headers if needed in future)
api.interceptors.request.use(
  (config) => {
    // Configuration for HttpOnly cookies is handled by `withCredentials: true` above.
    // No specific token injection needed here for that strategy.
    return config;
  },
  (error: AxiosError) => {
    // Log unexpected errors during request setup
    Sentry.captureException(error, {
      extra: { context: "Axios Request Interceptor" },
    });
    return Promise.reject(error);
  }
);

// Response interceptor (handles global error responses)
api.interceptors.response.use(
  (response) => response, // Pass through successful responses
  (error: AxiosError) => {
    let errorCode = "NETWORK_ERROR";
    let errorMessage = "Network error. Please check your connection.";
    let errorDetails: any = null;
    let statusCode: number | null = null;

    if (error.response) {
      const { data, status } = error.response;
      statusCode = status;

      // Prioritize specific error code from backend response (A.2)
      errorCode = data?.error?.code || data?.code || `HTTP_${status}_ERROR`; // Adjusted to check common patterns
      // Prioritize specific error message from backend response
      errorMessage = data?.error?.message || data?.message || error.message; // Adjusted
      errorDetails = data?.error?.details || data?.details || null;

      console.error(
        `API Error ${status} (${errorCode}): ${errorMessage}`,
        errorDetails
      ); // Keep console for visibility

      // Handle specific HTTP statuses
      if (status === 401) {
        // Authentication required - Should be handled by specific logic triggering logout (A.3)
        errorMessage =
          data?.error?.message || "Authentication failed or session expired.";
        console.warn(
          "Received 401 Unauthorized. Application should trigger logout."
        );
        // Note: Direct signOut() call commented out as it should ideally be handled
        // by the consuming code (e.g., React Query global onError) based on the error status.
        // signOut({ callbackUrl: '/login' });
      } else if (status === 403) {
        // Permission denied
        errorMessage = data?.error?.message || "Permission denied.";
        // Note: Direct toast commented out - handle in consuming code (A.3)
        // toast.error(errorMessage);
      } else if (status >= 400 && status < 500) {
        // Other client errors (400, 404, 409, 422 etc.) - Log warning, reject for specific handling
        Sentry.captureMessage(`Client Error ${status}: ${errorMessage}`, {
          level: "warning",
          extra: {
            code: errorCode,
            details: errorDetails,
            config: error.config,
          },
        });
        // Reject so that React Query's onError or specific form handlers can use the error details
        // (including errorCode and specific message from backend)
        // Adding structured error details to the rejected error object
        error.structuredError = {
          code: errorCode,
          message: errorMessage,
          details: errorDetails,
          status: statusCode,
        };
        return Promise.reject(error);
      } else if (status >= 500) {
        // Server errors - Log error, reject with generic message for UI
        errorMessage =
          "A server error occurred. Please try again later or contact support."; // Generic message
        Sentry.captureException(error, {
          extra: {
            code: errorCode,
            details: errorDetails,
            config: error.config,
          },
          level: "error",
        });
        // Note: Direct toast commented out - handle in consuming code (A.3)
        // toast.error(errorMessage);
      }
    } else if (error.request) {
      // Network error: No response received
      errorCode = "NETWORK_NO_RESPONSE";
      errorMessage =
        "Could not reach the server. Please check your connection.";
      console.error("Network Error: No response received", error.request);
      Sentry.captureException(error, {
        level: "error",
        extra: { code: errorCode },
      });
      // Note: Direct toast commented out - handle in consuming code (A.3)
      // toast.error(errorMessage);
    } else {
      // Request setup error
      errorCode = "REQUEST_SETUP_ERROR";
      errorMessage = "Error setting up request. Please try again.";
      console.error("Request Setup Error", error.message);
      Sentry.captureException(error, {
        level: "error",
        extra: { code: errorCode },
      });
      // Note: Direct toast commented out - handle in consuming code (A.3)
      // toast.error(errorMessage);
    }

    // Add structured error details for consistent handling by consuming code
    error.structuredError = {
      code: errorCode,
      message: errorMessage, // Use potentially refined message
      details: errorDetails,
      status: statusCode,
    };

    return Promise.reject(error);
  }
);

export default api;
