/**
 * Application constants for the Layout Builder
 * Centralizes all magic numbers and configuration values
 */

// Canvas dimensions
export const CANVAS_WIDTH = 800;
export const CANVAS_HEIGHT = 600;

// Grid system
export const GRID_SIZE = 10;

// Element limits
export const MAX_ELEMENTS_PER_LAYOUT = 100;
export const MAX_ELEMENT_WIDTH = 1000;
export const MAX_ELEMENT_HEIGHT = 1000;
export const MIN_ELEMENT_WIDTH = 1;
export const MIN_ELEMENT_HEIGHT = 1;

// Position limits
export const MAX_POSITION_X = 10000;
export const MAX_POSITION_Y = 10000;
export const MIN_POSITION_X = 0;
export const MIN_POSITION_Y = 0;

// Text element limits
export const MAX_TEXT_LENGTH = 500;
export const MIN_TEXT_LENGTH = 1;
export const MAX_FONT_SIZE = 72;
export const MIN_FONT_SIZE = 8;
export const MAX_FONT_FAMILY_LENGTH = 50;

// Button element limits
export const MAX_BUTTON_TEXT_LENGTH = 100;
export const MIN_BUTTON_TEXT_LENGTH = 1;

// Image element limits
export const MAX_ALT_TEXT_LENGTH = 200;
export const MIN_ALT_TEXT_LENGTH = 1;

// Layout name limits
export const MAX_LAYOUT_NAME_LENGTH = 100;
export const MIN_LAYOUT_NAME_LENGTH = 1;

// User ID limits
export const MAX_USER_ID_LENGTH = 100;
export const MIN_USER_ID_LENGTH = 1;

// Element ID limits
export const MAX_ELEMENT_ID_LENGTH = 100;
export const MIN_ELEMENT_ID_LENGTH = 1;

// Default element dimensions
export const DEFAULT_ELEMENT_WIDTH = GRID_SIZE * 5; // 50px
export const DEFAULT_ELEMENT_HEIGHT = GRID_SIZE * 4; // 40px

// Default text properties
export const DEFAULT_FONT_SIZE = 14;
export const DEFAULT_FONT_FAMILY = 'Arial';

// Default text content
export const DEFAULT_TEXT_CONTENT = 'Text Box';
export const DEFAULT_BUTTON_TEXT = 'Button';
export const DEFAULT_IMAGE_ALT = 'Image';

// History limits
export const MAX_HISTORY_SIZE = 50;

// API configuration
export const DEFAULT_API_URL = 'http://localhost:3001';

// File naming
export const DEFAULT_LAYOUT_NAME = 'Untitled Layout';
export const COPY_PREFIX = 'COPY OF ';

// Validation messages
export const ERROR_MESSAGES = {
  EMPTY_LAYOUT: 'Cannot save empty layout',
  EMPTY_NAME: 'Please enter a layout name',
  NO_LAYOUT_TO_DELETE: 'No layout to delete',
  NO_LAYOUT_TO_SHARE: 'Cannot share unsaved layout',
  EMPTY_DOWNLOAD: 'Cannot download empty layout',
  USER_NOT_LOGGED_IN: 'User not logged in',
  FAILED_TO_FETCH_LAYOUTS: 'Failed to fetch layouts',
  FAILED_TO_CREATE_LAYOUT: 'Failed to create layout',
  FAILED_TO_UPDATE_LAYOUT: 'Failed to update layout',
  FAILED_TO_DELETE_LAYOUT: 'Failed to delete layout',
  FAILED_TO_FETCH_LAYOUT: 'Failed to fetch layout',
  FAILED_TO_SHARE_LAYOUT: 'Failed to share layout',
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  SHARE_LINK_COPIED: 'Share link copied to clipboard!',
  FAILED_TO_COPY: 'Failed to copy link. Please copy manually: ',
} as const; 