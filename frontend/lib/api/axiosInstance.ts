// frontend/lib/api/axiosInstance.ts
// Centralized Axios instance for backend communication, including interceptors.
// Implements requirements from Tasks: FE-010, FE-011, FE-012, FE-024.

// FIX: Import types correctly using 'type' keyword
import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/nextjs";
// import { toast } from 'react-hot-toast'; // Example import - Use actual project toast library

// --- Custom Error Classes (Optional Improvement B.2) ---
/**
 * Custom error for distinguishing Unauthorized API responses.
 */
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Custom error for distinguishing Forbidden API responses.
 */
export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

/**
 * Custom error for distinguishing general Server API errors.
 */
export class ServerError extends Error {
  status: number;
  data?: any;
  constructor(message = "Server Error", status: number, data?: any) {
    super(message);
    this.name = "ServerError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Custom error for distinguishing network errors during API calls.
 */
export class NetworkError extends Error {
  constructor(message = "Network Error") {
    super(message);
    this.name = "NetworkError";
  }
}
// --- End Custom Error Classes ---

/**
 * Centralized Axios instance configuration.
 */
const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000", // FE-010, A.5
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // **MANDATORY VERIFICATION (A.2):** Assumes HttpOnly session cookies handled by browser.
  // Remove/change if using token-based authentication (requires request interceptor).
  withCredentials: true, // FE-011 (Cookie-based assumption)
});

/**
 * Axios Request Interceptor (Optional Improvement B.3)
 * Logs outgoing requests during development for debugging purposes.
 */
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log request details only in development
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    // Log request setup errors (less common)
    console.error("[API Request Setup Error]:", error);
    return Promise.reject(error);
  }
);

/**
 * Axios Response Interceptor (FE-012)
 * Handles common HTTP error statuses globally and logs relevant errors.
 */
api.interceptors.response.use(
  (response) => {
    // Pass through successful responses
    return response;
  },
  (error: AxiosError) => {
    // Type annotation remains the same here
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { status, data, config } = error.response;
      // **Note B.1:** Backend should ideally return structured errors like { code: '...', message: '...' }
      const errorCode = (data as any)?.code; // Attempt to get specific code
      const errorMessage = (data as any)?.message || error.message; // Use specific message or default

      switch (status) {
        case 401:
          console.error(`[API Error ${status}] Unauthorized: ${errorMessage}`, {
            url: config.url,
          });
          // **MANDATORY (A.3):** Throw a specific error instead of calling signOut directly.
          // Higher-level logic (e.g., global RQ error handler) should catch this
          // and trigger the actual logout UI flow.
          throw new UnauthorizedError("Session expired or invalid.");
        // break; // Unreachable after throw

        case 403:
          console.error(`[API Error ${status}] Forbidden: ${errorMessage}`, {
            url: config.url,
          });
          // **MANDATORY (A.4):** Display user-friendly toast. Mapping errorCode is ideal (B.1).
          // toast.error(`Permission Denied${errorCode ? ` (${errorCode})` : ''}.`);
          // Throw specific error for potential specific handling
          throw new ForbiddenError(
            `Permission Denied${errorCode ? ` (${errorCode})` : ""}.`
          );
        // break; // Unreachable after throw

        case 500:
        case 501:
        case 502:
        case 503:
        case 504:
          console.error(`[API Error ${status}] Server Error: ${errorMessage}`, {
            url: config.url,
            data,
          });
          // **MANDATORY (A.6 / FE-024):** Log server errors to Sentry
          Sentry.captureException(error, {
            extra: {
              // **Optional Improvement B.4:** Add context
              url: config.url,
              method: config.method,
              status: status,
              response_data: data, // Be cautious about logging sensitive response data
            },
            tags: { api_error_type: "Server" },
          });
          // **MANDATORY (A.4):** Display user-friendly toast.
          // toast.error('A server error occurred. Please try again later or contact support.');
          // Throw specific error
          throw new ServerError(`Server Error: ${status}`, status, data);
        // break; // Unreachable after throw

        default:
          // Handle other client errors (4xx) or unexpected statuses
          console.warn(`[API Unhandled Error ${status}]: ${errorMessage}`, {
            url: config.url,
            data,
          });
          // Optionally log less critical client errors to Sentry if needed
          // Sentry.captureMessage(`API Client Error ${status}: ${errorMessage}`, { extra: { url: config.url, data }});
          // You might still want to show a generic error toast here
          // toast.error(`An error occurred (${status}).`);
          break; // Break here as we don't throw for every default case
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error("[API Network Error]:", error.message);
      // **MANDATORY (A.4):** Display user-friendly toast.
      // toast.error('Network error. Please check your connection and try again.');
      // Optionally log to Sentry if persistent
      // Sentry.captureException(new Error('Network Error'), { extra: { request_details: error.request }});
      throw new NetworkError("Network error");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("[API Request Setup Error]:", error.message);
      // toast.error('An error occurred while setting up the request.'); // A.4
      // Optionally log to Sentry
      // Sentry.captureException(error);
    }

    // **MANDATORY (A.7):** Reject the promise so callers can handle the error state
    return Promise.reject(error);
  }
);

export default api;
