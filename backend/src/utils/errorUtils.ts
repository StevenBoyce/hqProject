/**
 * Error handling utilities for the Layout Builder backend
 * Provides standardized error responses and logging
 */

import { Request, Response } from 'express';

// Extend Express Request to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

/**
 * Standard API error response interface
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Standard API success response interface
 */
export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Create a standardized error response
 * @param message - Error message
 * @param code - Error code (optional)
 * @param details - Additional error details (optional)
 * @returns Standardized error response object
 */
export function createErrorResponse(
  message: string,
  code?: string,
  details?: unknown
): ApiErrorResponse {
  return {
    success: false,
    message,
    code,
    details,
  };
}

/**
 * Create a standardized success response
 * @param data - Response data
 * @param message - Success message (optional)
 * @returns Standardized success response object
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): ApiSuccessResponse<T> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Send a standardized error response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param code - Error code (optional)
 * @param details - Additional error details (optional)
 */
export function sendErrorResponse(
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown
): void {
  const errorResponse = createErrorResponse(message, code, details);
  res.status(statusCode).json(errorResponse);
}

/**
 * Send a standardized success response
 * @param res - Express response object
 * @param data - Response data
 * @param message - Success message (optional)
 * @param statusCode - HTTP status code (default: 200)
 */
export function sendSuccessResponse<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = 200
): void {
  const successResponse = createSuccessResponse(data, message);
  res.status(statusCode).json(successResponse);
}

/**
 * Handle and log errors with standardized response
 * @param req - Express request object
 * @param res - Express response object
 * @param error - The error that occurred
 * @param operation - The operation that failed (for logging)
 */
export function handleError(
  req: Request,
  res: Response,
  error: unknown,
  operation: string
): void {
  console.error(`Error in ${operation}:`, {
    method: req.method,
    url: req.url,
    userId: req.user?.id,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
  });

  let message = 'An unexpected error occurred';
  let statusCode = 500;

  if (error instanceof Error) {
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (typeof error === 'object' && error !== null && 'message' in error) {
    message = String((error as { message: unknown }).message);
  }

  // Handle specific error types
  if (error instanceof Error) {
    if (error.name === 'ValidationError') {
      statusCode = 400;
    } else if (error.name === 'UnauthorizedError') {
      statusCode = 401;
    } else if (error.name === 'ForbiddenError') {
      statusCode = 403;
    } else if (error.name === 'NotFoundError') {
      statusCode = 404;
    }
  }

  sendErrorResponse(res, statusCode, message);
}

/**
 * Validate if an object is a valid API error response
 * @param obj - Object to validate
 * @returns True if object is a valid API error response
 */
export function isApiErrorResponse(obj: unknown): obj is ApiErrorResponse {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'success' in obj &&
    (obj as ApiErrorResponse).success === false &&
    'message' in obj &&
    typeof (obj as ApiErrorResponse).message === 'string'
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
  
  if (isApiErrorResponse(error)) {
    return error.message;
  }
  
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  
  return 'An unknown error occurred';
} 