// frontend/lib/api/axiosInstance.ts
// Centralized Axios instance for backend communication, including interceptors.

import axios from "axios"; // Default export for the instance
// Standard named import for Axios types (v1.x+)
import { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import * as Sentry from "@sentry/nextjs";
// Import toast when UI library is integrated and provides it.
// import { toast } from '@/components/ui/use-toast';

// Custom Error Classes (Remain unchanged)
export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
export class ForbiddenError extends Error {
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}
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
export class NetworkError extends Error {
  constructor(message = "Network Error") {
    super(message);
    this.name = "NetworkError";
  }
}

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

// Request Interceptor (Basic Logging)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (process.env.NODE_ENV === "development") {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.url}`
      );
    }
    return config;
  },
  (error) => {
    console.error("[API Request Setup Error]:", error);
    return Promise.reject(error);
  }
);

// Response Interceptor (Error Handling & Logging)
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Using the correct AxiosError type
    if (error.response) {
      const { status, data, config } = error.response;
      // Use optional chaining ?. and nullish coalescing ?? for safer access, even with types
      const errorCode = (data as any)?.code;
      const errorMessage =
        (data as any)?.message ?? error.message ?? "An unknown error occurred";

      switch (status) {
        case 401: // Unauthorized
          console.error(`[API Error ${status}] Unauthorized: ${errorMessage}`, {
            url: config?.url,
          });
          throw new UnauthorizedError(
            "Session expired or invalid. Please log in again."
          );

        case 403: // Forbidden
          console.error(`[API Error ${status}] Forbidden: ${errorMessage}`, {
            url: config?.url,
          });
          throw new ForbiddenError(
            `Permission Denied.${errorCode ? ` (Code: ${errorCode})` : ""}`
          );

        case 500: // Server Errors
        case 501:
        case 502:
        case 503:
        case 504:
          console.error(`[API Error ${status}] Server Error: ${errorMessage}`, {
            url: config?.url,
            data,
          });
          Sentry.captureException(error, {
            extra: {
              url: config?.url,
              method: config?.method,
              status,
              response_data: data,
            },
            tags: { api_error_type: "Server" },
          });
          throw new ServerError(`Server Error: ${status}`, status, data);

        default: // Other 4xx errors
          console.warn(`[API Unhandled Error ${status}]: ${errorMessage}`, {
            url: config?.url,
            data,
          });
          break;
      }
    } else if (error.request) {
      // Network Error
      console.error("[API Network Error]:", error.message);
      Sentry.captureException(new NetworkError("Network request failed"), {
        tags: { api_error_type: "Network" },
      });
      throw new NetworkError("Network error. Please check your connection.");
    } else {
      // Request Setup Error
      console.error("[API Request Setup Error]:", error.message);
      Sentry.captureException(error, {
        tags: { api_error_type: "Request Setup" },
      });
      // Rethrowing a generic error might be better here if message isn't reliable
      throw new Error("Failed to setup API request.");
    }

    // Propagate the error for handling by React Query or other calling code
    // Check if it's already one of our custom errors, otherwise wrap it
    if (
      error instanceof UnauthorizedError ||
      error instanceof ForbiddenError ||
      error instanceof ServerError ||
      error instanceof NetworkError
    ) {
      return Promise.reject(error);
    }
    // If it's a non-response/non-request error or an unhandled default 4xx,
    // reject with the original error object, which might be useful higher up.
    return Promise.reject(error);
  }
);

export default api;
