/**
 * Happy-path API tests for layout endpoints
 * Tests the normal, expected flow when everything works correctly
 */

// Mock Prisma client before importing any modules
const mockPrisma = {
  layout: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Import modules after mocking
import request from 'supertest';
import express from 'express';
import layoutRoutes from '../../routes/layoutRoutes';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/layouts', layoutRoutes);

describe('Layout API - Happy Path Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('POST /api/layouts - Create Layout', () => {
    it('should successfully create a new layout with valid data', async () => {
      // Arrange: Prepare test data
      const validLayoutPayload = {
        name: 'My Test Layout',
        userId: 'test-user-123',
        content: [
          {
            id: 'element-1',
            type: 'text',
            x: 100,
            y: 100,
            width: 200,
            height: 50,
            text: 'Hello World',
            fontSize: 16,
            fontFamily: 'Arial',
          },
        ],
      };

      const expectedCreatedLayout = {
        id: 'layout-123',
        name: 'My Test Layout',
        userId: 'test-user-123',
        content: validLayoutPayload.content,
        createdAt: new Date('2024-01-01T00:00:00Z'), // Date object
        updatedAt: new Date('2024-01-01T00:00:00Z'), // Date object
      };

      // Mock the Prisma create method to return the expected layout
      mockPrisma.layout.create.mockResolvedValue(expectedCreatedLayout);

      // Act: Make the API request
      const response = await request(app)
        .post('/api/layouts')
        .send(validLayoutPayload)
        .expect('Content-Type', /json/)
        .expect(201); // 201 Created

      // Assert: Verify the response
      expect(response.body).toMatchObject({
        id: 'layout-123',
        name: 'My Test Layout',
        userId: 'test-user-123',
        content: validLayoutPayload.content,
      });
      expect(response.body.createdAt).toBe('2024-01-01T00:00:00.000Z');
      expect(response.body.updatedAt).toBe('2024-01-01T00:00:00.000Z');

      // Assert: Verify Prisma was called with correct data
      expect(mockPrisma.layout.create).toHaveBeenCalledWith({
        data: {
          name: 'My Test Layout',
          userId: 'test-user-123',
          content: validLayoutPayload.content,
        },
      });

      // Assert: Verify the response structure
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'My Test Layout');
      expect(response.body).toHaveProperty('userId', 'test-user-123');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('createdAt');
      expect(response.body).toHaveProperty('updatedAt');
      expect(Array.isArray(response.body.content)).toBe(true);
      expect(response.body.content).toHaveLength(1);
    });
  });
}); 