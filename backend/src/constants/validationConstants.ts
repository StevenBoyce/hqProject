/**
 * Validation constants for the Layout Builder API
 * Centralizes all validation limits and bounds
 */

// String length limits
export const MAX_LAYOUT_NAME_LENGTH = 100;
export const MIN_LAYOUT_NAME_LENGTH = 1;
export const MAX_USER_ID_LENGTH = 100;
export const MIN_USER_ID_LENGTH = 1;
export const MAX_ELEMENT_ID_LENGTH = 100;
export const MIN_ELEMENT_ID_LENGTH = 1;
export const MAX_TEXT_LENGTH = 500;
export const MIN_TEXT_LENGTH = 1;
export const MAX_BUTTON_TEXT_LENGTH = 100;
export const MIN_BUTTON_TEXT_LENGTH = 1;
export const MAX_ALT_TEXT_LENGTH = 200;
export const MIN_ALT_TEXT_LENGTH = 1;
export const MAX_FONT_FAMILY_LENGTH = 50;

// Numeric bounds
export const MAX_ELEMENTS_PER_LAYOUT = 100;
export const MAX_ELEMENT_WIDTH = 1000;
export const MAX_ELEMENT_HEIGHT = 1000;
export const MIN_ELEMENT_WIDTH = 1;
export const MIN_ELEMENT_HEIGHT = 1;
export const MAX_POSITION_X = 10000;
export const MAX_POSITION_Y = 10000;
export const MIN_POSITION_X = 0;
export const MIN_POSITION_Y = 0;
export const MAX_FONT_SIZE = 72;
export const MIN_FONT_SIZE = 8;

// Array limits
export const MAX_ELEMENTS_ARRAY_LENGTH = 100;

// Validation error messages
export const VALIDATION_ERRORS = {
  LAYOUT_NAME_TOO_SHORT: `Layout name must be at least ${MIN_LAYOUT_NAME_LENGTH} character`,
  LAYOUT_NAME_TOO_LONG: `Layout name must be no more than ${MAX_LAYOUT_NAME_LENGTH} characters`,
  USER_ID_TOO_SHORT: `User ID must be at least ${MIN_USER_ID_LENGTH} character`,
  USER_ID_TOO_LONG: `User ID must be no more than ${MAX_USER_ID_LENGTH} characters`,
  ELEMENT_ID_TOO_SHORT: `Element ID must be at least ${MIN_ELEMENT_ID_LENGTH} character`,
  ELEMENT_ID_TOO_LONG: `Element ID must be no more than ${MAX_ELEMENT_ID_LENGTH} characters`,
  TEXT_TOO_SHORT: `Text must be at least ${MIN_TEXT_LENGTH} character`,
  TEXT_TOO_LONG: `Text must be no more than ${MAX_TEXT_LENGTH} characters`,
  BUTTON_TEXT_TOO_SHORT: `Button text must be at least ${MIN_BUTTON_TEXT_LENGTH} character`,
  BUTTON_TEXT_TOO_LONG: `Button text must be no more than ${MAX_BUTTON_TEXT_LENGTH} characters`,
  ALT_TEXT_TOO_SHORT: `Alt text must be at least ${MIN_ALT_TEXT_LENGTH} character`,
  ALT_TEXT_TOO_LONG: `Alt text must be no more than ${MAX_ALT_TEXT_LENGTH} characters`,
  FONT_FAMILY_TOO_LONG: `Font family must be no more than ${MAX_FONT_FAMILY_LENGTH} characters`,
  TOO_MANY_ELEMENTS: `Layout cannot have more than ${MAX_ELEMENTS_PER_LAYOUT} elements`,
  ELEMENT_WIDTH_TOO_SMALL: `Element width must be at least ${MIN_ELEMENT_WIDTH}`,
  ELEMENT_WIDTH_TOO_LARGE: `Element width must be no more than ${MAX_ELEMENT_WIDTH}`,
  ELEMENT_HEIGHT_TOO_SMALL: `Element height must be at least ${MIN_ELEMENT_HEIGHT}`,
  ELEMENT_HEIGHT_TOO_LARGE: `Element height must be no more than ${MAX_ELEMENT_HEIGHT}`,
  POSITION_X_TOO_SMALL: `X position must be at least ${MIN_POSITION_X}`,
  POSITION_X_TOO_LARGE: `X position must be no more than ${MAX_POSITION_X}`,
  POSITION_Y_TOO_SMALL: `Y position must be at least ${MIN_POSITION_Y}`,
  POSITION_Y_TOO_LARGE: `Y position must be no more than ${MAX_POSITION_Y}`,
  FONT_SIZE_TOO_SMALL: `Font size must be at least ${MIN_FONT_SIZE}`,
  FONT_SIZE_TOO_LARGE: `Font size must be no more than ${MAX_FONT_SIZE}`,
  INVALID_ELEMENT_TYPE: 'Invalid element type',
  INVALID_ELEMENT_DATA: 'Invalid element data',
} as const; 