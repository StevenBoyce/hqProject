/**
 * Rate limiting constants for the Layout Builder API
 * Centralizes rate limiting configuration
 */

// Rate limiting windows (in milliseconds)
export const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_WINDOW_SHORT_MS = 60 * 1000; // 1 minute

// Rate limiting limits
export const RATE_LIMIT_MAX_REQUESTS = 100; // requests per window
export const RATE_LIMIT_MAX_REQUESTS_SHORT = 10; // requests per short window

// Rate limiting headers
export const RATE_LIMIT_HEADERS = {
  REMAINING: 'X-RateLimit-Remaining',
  RESET: 'X-RateLimit-Reset',
  LIMIT: 'X-RateLimit-Limit',
} as const;

// Rate limiting error messages
export const RATE_LIMIT_ERRORS = {
  TOO_MANY_REQUESTS: 'Too many requests, please try again later',
  RATE_LIMIT_EXCEEDED: 'Rate limit exceeded',
} as const; 