// File: frontend/lib/api/axiosInstance.ts
// Task IDs: FE-010, FE-011, FE-012, FE-024
// Status: Revised - Attempting minimal augmentation for TS2428 fix.

import axios from "axios";
// Import the original type with an alias
import type {
  AxiosError as OriginalAxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import * as Sentry from "@sentry/nextjs";
// import { signOut } from 'next-auth/react';
// import { toast } from 'react-hot-toast';
// import { getErrorMessageFromCode } from '@/lib/errorMapping';

// --- Define Expected Backend Error Structure ---
interface BackendErrorData {
  error?: {
    code?: string;
    message?: string;
    details?: any;
  };
  code?: string;
  message?: string;
  details?: any;
}
// --- End Backend Error Structure Definition ---

// Define a type for the structured error added to AxiosError instances
interface StructuredError {
  code: string;
  message: string;
  status: number | null;
  details?: any;
}

// Extend AxiosError interface - MINIMAL AUGMENTATION
// Only declare the interface and the added property.
declare module "axios" {
  export interface AxiosError {
    // No generic parameters or 'extends Error' here
    structuredError?: StructuredError;
    // Ensure config is typed correctly if accessed (it is accessed below)
    // Note: Augmenting config type might be needed if TS still complains here,
    // but let's try accessing it directly first.
    // config: InternalAxiosRequestConfig<any>;
  }
}

// Type alias for usage within this file - Refers to the ORIGINAL AxiosError type
// The augmentation above adds the property globally, but type hints use the original signature.
type AxiosError<T = any, D = any> = OriginalAxiosError<T, D>;

const api = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  timeout: 15000, // 15 seconds
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error: AxiosError) => {
    // Uses the original AxiosError type signature
    // Explicit cast needed if accessing structuredError here
    // Sentry.captureException(error as CoreAxiosError); // Example if Sentry needs the augmented type
    Sentry.captureException(error, {
      // Sentry likely handles 'any' or standard Error well
      extra: { context: "Axios Request Interceptor" },
    });
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorData>) => {
    // Uses original AxiosError signature + data type
    let errorCode = "NETWORK_ERROR";
    let errorMessage = "Network error. Please check your connection.";
    let errorDetails: any = null;
    let statusCode: number | null = null;
    let userFriendlyMessage = errorMessage; // Start with default

    // Cast error to access the augmented property type safely when needed
    const augmentedError = error as OriginalAxiosError<BackendErrorData>;

    if (augmentedError.response) {
      const backendData = augmentedError.response.data;
      const status = augmentedError.response.status;
      statusCode = status;

      errorCode =
        backendData?.error?.code || backendData?.code || `HTTP_${status}_ERROR`;
      errorMessage =
        backendData?.error?.message ||
        backendData?.message ||
        augmentedError.message;
      errorDetails =
        backendData?.error?.details || backendData?.details || null;

      console.error(
        `API Error ${status} (${errorCode}): ${errorMessage}`,
        errorDetails
      );

      // Handle specific HTTP statuses
      if (status === 401) {
        userFriendlyMessage =
          "Authentication failed or session expired. Please log in again.";
        console.warn(
          "Received 401 Unauthorized. Application should trigger logout."
        );
      } else if (status === 403) {
        userFriendlyMessage =
          "You do not have permission to perform this action.";
      } else if (status >= 400 && status < 500) {
        Sentry.captureMessage(`Client Error ${status}: ${errorMessage}`, {
          level: "warning",
          extra: {
            code: errorCode,
            details: errorDetails,
            config: augmentedError.config, // Access config via casted error
          },
        });

        switch (errorCode) {
          case "INVALID_INPUT":
          case "VALIDATION_ERROR":
            userFriendlyMessage =
              "Please check the information you provided and try again.";
            break;
          case "NOT_FOUND":
            userFriendlyMessage = "The requested item could not be found.";
            break;
          case "INVALID_TOKEN":
            userFriendlyMessage =
              "The provided token is invalid or has expired.";
            break;
          default:
            userFriendlyMessage =
              errorMessage !== augmentedError.message // Use casted error here too
                ? errorMessage
                : "An error occurred. Please try again.";
        }
      } else if (status >= 500) {
        userFriendlyMessage =
          "A server error occurred. Please try again later or contact support.";
        Sentry.captureException(augmentedError, {
          // Capture the original error object
          extra: {
            code: errorCode,
            details: errorDetails,
            config: augmentedError.config, // Access config via casted error
          },
          level: "error",
        });
      }
    } else if (augmentedError.request) {
      errorCode = "NETWORK_NO_RESPONSE";
      userFriendlyMessage =
        "Could not reach the server. Please check your connection.";
      console.error(
        "Network Error: No response received",
        augmentedError.request
      );
      Sentry.captureException(augmentedError, {
        level: "error",
        extra: { code: errorCode },
      });
    } else {
      errorCode = "REQUEST_SETUP_ERROR";
      userFriendlyMessage = "Error setting up request. Please try again.";
      console.error("Request Setup Error", augmentedError.message);
      Sentry.captureException(augmentedError, {
        level: "error",
        extra: { code: errorCode },
      });
    }

    // Explicitly cast to the augmented type when ASSIGNING the custom property.
    // This tells TS "trust me, this property exists now because of the module augmentation".
    augmentedError.structuredError = {
      code: errorCode,
      message: userFriendlyMessage,
      details: errorDetails,
      status: statusCode,
    };

    return Promise.reject(augmentedError); // Reject the original (now modified) error object
  }
);

export default api;
