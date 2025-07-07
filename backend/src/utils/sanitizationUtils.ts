/**
 * Sanitization utilities for the Layout Builder backend
 * Provides centralized sanitization logic for user inputs
 */

// Note: DOMPurify would need to be installed as a dependency
// For now, using basic sanitization without external library
// import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize HTML string to prevent XSS attacks
 * @param html - HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }
  
  // Basic HTML sanitization without external library
  // In production, consider using DOMPurify or similar library
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Sanitize plain text by removing HTML tags and dangerous characters
 * @param text - Text to sanitize
 * @returns Sanitized text
 */
export function sanitizeText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  // Remove HTML tags
  const withoutHtml = text.replace(/<[^>]*>/g, '');
  
  // Remove potentially dangerous characters
  const sanitized = withoutHtml
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();
  
  return sanitized;
}

/**
 * Sanitize URL to prevent injection attacks
 * @param url - URL to sanitize
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }
  
  const trimmed = url.trim();
  
  // Check if it's a valid URL
  try {
    const parsed = new URL(trimmed);
    
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    
    return parsed.toString();
  } catch {
    return '';
  }
}

/**
 * Sanitize layout name
 * @param name - Layout name to sanitize
 * @returns Sanitized layout name
 */
export function sanitizeLayoutName(name: string): string {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  return sanitizeText(name)
    .replace(/[^\w\s\-_]/g, '') // Remove special characters except spaces, hyphens, underscores
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Sanitize element text content
 * @param text - Text content to sanitize
 * @returns Sanitized text content
 */
export function sanitizeElementText(text: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  
  return sanitizeText(text)
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Sanitize font family name
 * @param fontFamily - Font family to sanitize
 * @returns Sanitized font family
 */
export function sanitizeFontFamily(fontFamily: string): string {
  if (!fontFamily || typeof fontFamily !== 'string') {
    return 'Arial';
  }
  
  const sanitized = sanitizeText(fontFamily)
    .replace(/[^\w\s\-_,]/g, '') // Allow letters, numbers, spaces, hyphens, underscores, commas
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
  
  return sanitized || 'Arial';
}

/**
 * Sanitize image alt text
 * @param altText - Alt text to sanitize
 * @returns Sanitized alt text
 */
export function sanitizeAltText(altText: string): string {
  if (!altText || typeof altText !== 'string') {
    return '';
  }
  
  return sanitizeText(altText)
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

/**
 * Sanitize user ID
 * @param userId - User ID to sanitize
 * @returns Sanitized user ID
 */
export function sanitizeUserId(userId: string): string {
  if (!userId || typeof userId !== 'string') {
    return '';
  }
  
  return sanitizeText(userId)
    .replace(/[^\w\-_]/g, '') // Only allow letters, numbers, hyphens, underscores
    .trim();
}

/**
 * Sanitize element ID
 * @param elementId - Element ID to sanitize
 * @returns Sanitized element ID
 */
export function sanitizeElementId(elementId: string): string {
  if (!elementId || typeof elementId !== 'string') {
    return '';
  }
  
  return sanitizeText(elementId)
    .replace(/[^\w\-_]/g, '') // Only allow letters, numbers, hyphens, underscores
    .trim();
}

/**
 * Sanitize numeric value
 * @param value - Numeric value to sanitize
 * @param min - Minimum allowed value
 * @param max - Maximum allowed value
 * @param defaultValue - Default value if invalid
 * @returns Sanitized numeric value
 */
export function sanitizeNumber(
  value: unknown,
  min: number,
  max: number,
  defaultValue: number
): number {
  if (typeof value === 'number') {
    if (isNaN(value) || !isFinite(value)) {
      return defaultValue;
    }
    return Math.max(min, Math.min(max, value));
  }
  
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (isNaN(parsed) || !isFinite(parsed)) {
      return defaultValue;
    }
    return Math.max(min, Math.min(max, parsed));
  }
  
  return defaultValue;
}

/**
 * Sanitize boolean value
 * @param value - Boolean value to sanitize
 * @param defaultValue - Default value if invalid
 * @returns Sanitized boolean value
 */
export function sanitizeBoolean(value: unknown, defaultValue: boolean = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return true;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return false;
    }
  }
  
  if (typeof value === 'number') {
    return value !== 0;
  }
  
  return defaultValue;
}

/**
 * Sanitize array of strings
 * @param array - Array to sanitize
 * @param sanitizeItem - Function to sanitize each item
 * @returns Sanitized array
 */
export function sanitizeStringArray<T extends string>(
  array: unknown,
  sanitizeItem: (item: string) => T
): T[] {
  if (!Array.isArray(array)) {
    return [];
  }
  
  return array
    .filter((item): item is string => typeof item === 'string')
    .map(sanitizeItem)
    .filter(item => item.length > 0);
}

/**
 * Deep sanitize an object
 * @param obj - Object to sanitize
 * @param sanitizers - Object with sanitizer functions for each property
 * @returns Sanitized object
 */
export function deepSanitizeObject<T extends Record<string, unknown>>(
  obj: unknown,
  sanitizers: Record<string, (value: unknown) => unknown>
): T {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return {} as T;
  }
  
  const result = {} as T;
  
  for (const [key, sanitizer] of Object.entries(sanitizers)) {
    if (key in obj) {
      result[key as keyof T] = sanitizer((obj as Record<string, unknown>)[key]) as T[keyof T];
    }
  }
  
  return result;
} 