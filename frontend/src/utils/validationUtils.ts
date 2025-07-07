/**
 * Validation utilities for the Layout Builder frontend
 * Provides reusable validation functions and patterns
 */

import {
  MAX_LAYOUT_NAME_LENGTH,
  MIN_LAYOUT_NAME_LENGTH,
  MAX_TEXT_LENGTH,
  MIN_TEXT_LENGTH,
  MAX_BUTTON_TEXT_LENGTH,
  MIN_BUTTON_TEXT_LENGTH,
  MAX_ALT_TEXT_LENGTH,
  MIN_ALT_TEXT_LENGTH,
  MAX_FONT_SIZE,
  MIN_FONT_SIZE,
  MAX_FONT_FAMILY_LENGTH,
  MAX_ELEMENT_WIDTH,
  MIN_ELEMENT_WIDTH,
  MAX_ELEMENT_HEIGHT,
  MIN_ELEMENT_HEIGHT,
  MAX_POSITION_X,
  MIN_POSITION_X,
  MAX_POSITION_Y,
  MIN_POSITION_Y,
  MAX_ELEMENTS_PER_LAYOUT,
} from '../constants/appConstants';

import { Element } from '../types';

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validate layout name
 * @param name - Layout name to validate
 * @returns Validation result
 */
export function validateLayoutName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return {
      isValid: false,
      message: 'Layout name is required',
    };
  }

  if (name.length < MIN_LAYOUT_NAME_LENGTH) {
    return {
      isValid: false,
      message: `Layout name must be at least ${MIN_LAYOUT_NAME_LENGTH} character`,
    };
  }

  if (name.length > MAX_LAYOUT_NAME_LENGTH) {
    return {
      isValid: false,
      message: `Layout name must be no more than ${MAX_LAYOUT_NAME_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate text content
 * @param text - Text content to validate
 * @returns Validation result
 */
export function validateTextContent(text: string): ValidationResult {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      message: 'Text content is required',
    };
  }

  if (text.length < MIN_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Text must be at least ${MIN_TEXT_LENGTH} character`,
    };
  }

  if (text.length > MAX_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Text must be no more than ${MAX_TEXT_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate button text
 * @param text - Button text to validate
 * @returns Validation result
 */
export function validateButtonText(text: string): ValidationResult {
  if (!text || text.trim().length === 0) {
    return {
      isValid: false,
      message: 'Button text is required',
    };
  }

  if (text.length < MIN_BUTTON_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Button text must be at least ${MIN_BUTTON_TEXT_LENGTH} character`,
    };
  }

  if (text.length > MAX_BUTTON_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Button text must be no more than ${MAX_BUTTON_TEXT_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate alt text for images
 * @param altText - Alt text to validate
 * @returns Validation result
 */
export function validateAltText(altText: string): ValidationResult {
  if (!altText || altText.trim().length === 0) {
    return {
      isValid: false,
      message: 'Alt text is required for accessibility',
    };
  }

  if (altText.length < MIN_ALT_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Alt text must be at least ${MIN_ALT_TEXT_LENGTH} character`,
    };
  }

  if (altText.length > MAX_ALT_TEXT_LENGTH) {
    return {
      isValid: false,
      message: `Alt text must be no more than ${MAX_ALT_TEXT_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate font size
 * @param fontSize - Font size to validate
 * @returns Validation result
 */
export function validateFontSize(fontSize: number): ValidationResult {
  if (fontSize < MIN_FONT_SIZE) {
    return {
      isValid: false,
      message: `Font size must be at least ${MIN_FONT_SIZE}`,
    };
  }

  if (fontSize > MAX_FONT_SIZE) {
    return {
      isValid: false,
      message: `Font size must be no more than ${MAX_FONT_SIZE}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate font family
 * @param fontFamily - Font family to validate
 * @returns Validation result
 */
export function validateFontFamily(fontFamily: string): ValidationResult {
  if (!fontFamily || fontFamily.trim().length === 0) {
    return {
      isValid: false,
      message: 'Font family is required',
    };
  }

  if (fontFamily.length > MAX_FONT_FAMILY_LENGTH) {
    return {
      isValid: false,
      message: `Font family must be no more than ${MAX_FONT_FAMILY_LENGTH} characters`,
    };
  }

  return { isValid: true };
}

/**
 * Validate element dimensions
 * @param width - Element width
 * @param height - Element height
 * @returns Validation result
 */
export function validateElementDimensions(width: number, height: number): ValidationResult {
  if (width < MIN_ELEMENT_WIDTH) {
    return {
      isValid: false,
      message: `Element width must be at least ${MIN_ELEMENT_WIDTH}`,
    };
  }

  if (width > MAX_ELEMENT_WIDTH) {
    return {
      isValid: false,
      message: `Element width must be no more than ${MAX_ELEMENT_WIDTH}`,
    };
  }

  if (height < MIN_ELEMENT_HEIGHT) {
    return {
      isValid: false,
      message: `Element height must be at least ${MIN_ELEMENT_HEIGHT}`,
    };
  }

  if (height > MAX_ELEMENT_HEIGHT) {
    return {
      isValid: false,
      message: `Element height must be no more than ${MAX_ELEMENT_HEIGHT}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate element position
 * @param x - X position
 * @param y - Y position
 * @returns Validation result
 */
export function validateElementPosition(x: number, y: number): ValidationResult {
  if (x < MIN_POSITION_X) {
    return {
      isValid: false,
      message: `X position must be at least ${MIN_POSITION_X}`,
    };
  }

  if (x > MAX_POSITION_X) {
    return {
      isValid: false,
      message: `X position must be no more than ${MAX_POSITION_X}`,
    };
  }

  if (y < MIN_POSITION_Y) {
    return {
      isValid: false,
      message: `Y position must be at least ${MIN_POSITION_Y}`,
    };
  }

  if (y > MAX_POSITION_Y) {
    return {
      isValid: false,
      message: `Y position must be no more than ${MAX_POSITION_Y}`,
    };
  }

  return { isValid: true };
}

/**
 * Validate element based on its type
 * @param element - Element to validate
 * @returns Validation result
 */
export function validateElement(element: Element): ValidationResult {
  // Validate common properties
  const dimensionValidation = validateElementDimensions(element.width, element.height);
  if (!dimensionValidation.isValid) {
    return dimensionValidation;
  }

  const positionValidation = validateElementPosition(element.x, element.y);
  if (!positionValidation.isValid) {
    return positionValidation;
  }

  // Validate type-specific properties
  switch (element.type) {
    case 'text':
      if ('text' in element) {
        return validateTextContent(element.text);
      }
      break;

    case 'button':
      if ('text' in element) {
        return validateButtonText(element.text);
      }
      break;

    case 'image':
      if ('alt' in element) {
        return validateAltText(element.alt);
      }
      break;
  }

  return { isValid: true };
}

/**
 * Validate layout elements array
 * @param elements - Array of elements to validate
 * @returns Validation result
 */
export function validateLayoutElements(elements: Element[]): ValidationResult {
  if (elements.length > MAX_ELEMENTS_PER_LAYOUT) {
    return {
      isValid: false,
      message: `Layout cannot have more than ${MAX_ELEMENTS_PER_LAYOUT} elements`,
    };
  }

  for (const element of elements) {
    const validation = validateElement(element);
    if (!validation.isValid) {
      return validation;
    }
  }

  return { isValid: true };
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns Validation result
 */
export function validateUrl(url: string): ValidationResult {
  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return {
      isValid: false,
      message: 'Invalid URL format',
    };
  }
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns Validation result
 */
export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      message: 'Invalid email format',
    };
  }

  return { isValid: true };
} 