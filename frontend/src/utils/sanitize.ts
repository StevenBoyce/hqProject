/**
 * Sanitization utilities to prevent XSS
 */

// HTML entities that could be used for XSS
const HTML_ENTITIES: { [key: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#x60;',
  '=': '&#x3D;'
};

/**
 * Sanitizes text input by escaping HTML entities
 * This prevents XSS attacks by ensuring user input can't be interpreted as HTML
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input.replace(/[&<>"'`=\/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitizes layout name - allows alphanumeric, spaces, hyphens, and underscores
 * Removes any potentially dangerous characters
 */
export function sanitizeLayoutName(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Remove any HTML entities and dangerous characters
  const sanitized = sanitizeText(input);
  
  // Only allow alphanumeric, spaces, hyphens, underscores, and common punctuation
  // This regex allows: letters, numbers, spaces, hyphens, underscores, periods, commas
  return sanitized.replace(/[^a-zA-Z0-9\s\-_.,!?]/g, '');
}

/**
 * Truncates text to a maximum length to prevent extremely long inputs
 */
export function truncateText(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input.length > maxLength ? input.substring(0, maxLength) : input;
}

/**
 * Validates that input is not empty or just whitespace
 */
export function isValidInput(input: string): boolean {
  return typeof input === 'string' && input.trim().length > 0;
}

/**
 * Comprehensive sanitization for element text content
 */
export function sanitizeElementText(input: string): string {
  if (!isValidInput(input)) {
    return '';
  }
  
  // First sanitize HTML entities
  let sanitized = sanitizeText(input);
  
  // Truncate to reasonable length
  sanitized = truncateText(sanitized, 500);
  
  // Remove any remaining potentially dangerous patterns
  // This includes script tags, javascript: URLs, data: URLs, etc.
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/data:/gi, '');
  sanitized = sanitized.replace(/vbscript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, ''); // Remove event handlers
  
  return sanitized.trim();
} 