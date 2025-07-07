/**
 * Error handling utilities for the Layout Builder frontend
 * Provides standardized error handling and messaging
 */

import { ERROR_MESSAGES } from '../constants/appConstants';

/**
 * Standard error response interface
 */
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Standardized error message formatter
 * @param error - The error object or string
 * @param fallbackMessage - Fallback message if error is invalid
 * @returns Formatted error message
 */
export function formatErrorMessage(error: unknown, fallbackMessage: string): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return fallbackMessage;
}

/**
 * Handle API errors with standardized messaging
 * @param error - The API error response
 * @param operation - The operation that failed (for logging)
 * @returns Formatted error message
 */
export function handleApiError(error: unknown, operation: string): string {
  console.error(`API Error in ${operation}:`, error);
  
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    
    // Handle specific API error codes
    if (apiError.status === 401) {
      return 'Authentication required. Please log in again.';
    }
    
    if (apiError.status === 403) {
      return 'Access denied. You do not have permission for this action.';
    }
    
    if (apiError.status === 404) {
      return 'Resource not found.';
    }
    
    if (apiError.status === 429) {
      return 'Too many requests. Please wait before trying again.';
    }
    
    if (apiError.status && apiError.status >= 500) {
      return 'Server error. Please try again later.';
    }
    
    if (apiError.message) {
      return apiError.message;
    }
  }
  
  return ERROR_MESSAGES.FAILED_TO_FETCH_LAYOUTS;
}

/**
 * Create a standardized error object
 * @param message - Error message
 * @param status - HTTP status code (optional)
 * @param code - Error code (optional)
 * @returns Standardized error object
 */
export function createError(message: string, status?: number, code?: string): ApiError {
  return {
    message,
    status,
    code,
  };
}

/**
 * Validate if an object is a valid API error
 * @param obj - Object to validate
 * @returns True if object is a valid API error
 */
export function isApiError(obj: unknown): obj is ApiError {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    typeof (obj as ApiError).message === 'string'
  );
}

/**
 * Extract error message from various error types
 * @param error - Error to extract message from
 * @returns Error message string
 */
export function extractErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (isApiError(error)) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return 'An unknown error occurred';
} 