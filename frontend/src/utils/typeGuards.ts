/**
 * Type guards for the Layout Builder frontend
 * Provides runtime type checking utilities for safe type assertions
 */

import { Element, ElementType } from '../types';

/**
 * Check if a value is a valid ElementType
 * @param value - Value to check
 * @returns True if value is a valid ElementType
 */
export function isElementType(value: unknown): value is ElementType {
  return typeof value === 'string' && ['text', 'image', 'button'].includes(value);
}

/**
 * Check if a value is a valid Element
 * @param value - Value to check
 * @returns True if value is a valid Element
 */
export function isElement(value: unknown): value is Element {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const element = value as Record<string, unknown>;

  // Check required properties
  if (
    typeof element.id !== 'string' ||
    !isElementType(element.type) ||
    typeof element.x !== 'number' ||
    typeof element.y !== 'number' ||
    typeof element.width !== 'number' ||
    typeof element.height !== 'number'
  ) {
    return false;
  }

  // Check type-specific properties
  switch (element.type) {
    case 'text':
      return (
        typeof element.text === 'string' &&
        typeof element.fontSize === 'number' &&
        typeof element.fontFamily === 'string'
      );

    case 'button':
      return (
        typeof element.text === 'string' &&
        typeof element.onClick === 'function'
      );

    case 'image':
      return (
        typeof element.alt === 'string' &&
        (element.src === undefined || typeof element.src === 'string')
      );

    default:
      return false;
  }
}

/**
 * Check if a value is an array of Elements
 * @param value - Value to check
 * @returns True if value is an array of Elements
 */
export function isElementArray(value: unknown): value is Element[] {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(isElement);
}

/**
 * Check if a value is a valid layout object
 * @param value - Value to check
 * @returns True if value is a valid layout object
 */
export function isLayout(value: unknown): value is {
  id: string;
  name: string;
  elements: Element[];
  userId: string;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const layout = value as Record<string, unknown>;

  return (
    typeof layout.id === 'string' &&
    typeof layout.name === 'string' &&
    isElementArray(layout.elements) &&
    typeof layout.userId === 'string'
  );
}

/**
 * Check if a value is an array of layouts
 * @param value - Value to check
 * @returns True if value is an array of layouts
 */
export function isLayoutArray(value: unknown): value is Array<{
  id: string;
  name: string;
  elements: Element[];
  userId: string;
}> {
  if (!Array.isArray(value)) {
    return false;
  }

  return value.every(isLayout);
}

/**
 * Check if a value is a valid user object
 * @param value - Value to check
 * @returns True if value is a valid user object
 */
export function isUser(value: unknown): value is {
  id: string;
  name?: string;
  email?: string;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === 'string' &&
    (user.name === undefined || typeof user.name === 'string') &&
    (user.email === undefined || typeof user.email === 'string')
  );
}

/**
 * Check if a value is a valid API response
 * @param value - Value to check
 * @returns True if value is a valid API response
 */
export function isApiResponse<T>(value: unknown): value is {
  success: boolean;
  data?: T;
  message?: string;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    typeof response.success === 'boolean' &&
    (response.data === undefined || true) && // Data can be any type
    (response.message === undefined || typeof response.message === 'string')
  );
}

/**
 * Check if a value is a valid error response
 * @param value - Value to check
 * @returns True if value is a valid error response
 */
export function isErrorResponse(value: unknown): value is {
  success: false;
  message: string;
  code?: string;
  details?: unknown;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    response.success === false &&
    typeof response.message === 'string' &&
    (response.code === undefined || typeof response.code === 'string') &&
    (response.details === undefined || true) // Details can be any type
  );
}

/**
 * Check if a value is a valid success response
 * @param value - Value to check
 * @returns True if value is a valid success response
 */
export function isSuccessResponse<T>(value: unknown): value is {
  success: true;
  data: T;
  message?: string;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const response = value as Record<string, unknown>;

  return (
    response.success === true &&
    'data' in response &&
    (response.message === undefined || typeof response.message === 'string')
  );
}

/**
 * Check if a value is a valid navigation state
 * @param value - Value to check
 * @returns True if value is a valid navigation state
 */
export function isNavigationState(value: unknown): value is {
  layoutId?: string;
  layoutName?: string;
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Record<string, unknown>;

  return (
    (state.layoutId === undefined || typeof state.layoutId === 'string') &&
    (state.layoutName === undefined || typeof state.layoutName === 'string')
  );
}

/**
 * Check if a value is a valid history state
 * @param value - Value to check
 * @returns True if value is a valid history state
 */
export function isHistoryState(value: unknown): value is {
  past: Element[][];
  future: Element[][];
} {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const state = value as Record<string, unknown>;

  return (
    Array.isArray(state.past) &&
    state.past.every(isElementArray) &&
    Array.isArray(state.future) &&
    state.future.every(isElementArray)
  );
}

/**
 * Safe type assertion with runtime validation
 * @param value - Value to assert
 * @param guard - Type guard function
 * @param fallback - Fallback value if assertion fails
 * @returns Asserted value or fallback
 */
export function safeAssert<T>(
  value: unknown,
  guard: (value: unknown) => value is T,
  fallback: T
): T {
  return guard(value) ? value : fallback;
}

/**
 * Safe array assertion with runtime validation
 * @param value - Value to assert
 * @param itemGuard - Type guard function for array items
 * @param fallback - Fallback value if assertion fails
 * @returns Asserted array or fallback
 */
export function safeAssertArray<T>(
  value: unknown,
  itemGuard: (value: unknown) => value is T,
  fallback: T[] = []
): T[] {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value.filter(itemGuard);
} 