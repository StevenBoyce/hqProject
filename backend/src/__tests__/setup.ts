/**
 * Test setup file for Jest
 * Configures the test environment and global test utilities
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/layout_builder_test';

// Increase timeout for database operations
// Note: jest is available in test environment

// Global test utilities
(global as any).testUtils = {
  // Helper to create a valid layout payload for testing
  createValidLayoutPayload: () => ({
    name: 'Test Layout',
    userId: 'test-user-123',
    content: [
      {
        id: 'test-element-1',
        type: 'text' as const,
        x: 100,
        y: 100,
        width: 200,
        height: 50,
        text: 'Test Text',
        fontSize: 16,
        fontFamily: 'Arial',
      },
    ],
  }),

  // Helper to create a valid element for testing
  createValidElement: (type: 'text' | 'image' | 'button' = 'text') => {
    const baseElement = {
      id: `test-element-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 200,
      height: 50,
    };

    switch (type) {
      case 'text':
        return {
          ...baseElement,
          text: 'Test Text',
          fontSize: 16,
          fontFamily: 'Arial',
        };
      case 'image':
        return {
          ...baseElement,
          src: 'https://example.com/image.jpg',
          alt: 'Test Image',
        };
      case 'button':
        return {
          ...baseElement,
          text: 'Test Button',
        };
      default:
        return baseElement;
    }
  },
}; 