import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { 
  CreateLayoutSchema, 
  UpdateLayoutSchema, 
  LayoutsQuerySchema, 
  LayoutPathSchema,
  LayoutResponseSchema,
  LayoutsListResponseSchema,
  CreateLayoutRequest,
  UpdateLayoutRequest,
  LayoutsQuery,
  LayoutPath
} from '../validation/layoutSchemas';

const prisma = new PrismaClient();

export const layoutController = {
  // Create a new layout
  createLayout: async (req: Request, res: Response) => {
    try {
      const validatedData = CreateLayoutSchema.parse(req.body) as CreateLayoutRequest;
      
      const layout = await prisma.layout.create({
        data: {
          name: validatedData.name,
          userId: validatedData.userId,
          content: validatedData.content,
        },
      });

      const response = LayoutResponseSchema.parse(layout);
      res.status(201).json(response);
    } catch (error) {
      console.error('Error creating layout:', error);
      res.status(500).json({ error: 'Failed to create layout' });
    }
  },

  // Get all layouts for a user
  getLayoutsByUser: async (req: Request, res: Response) => {
    try {
      const validatedQuery = LayoutsQuerySchema.parse(req.query) as LayoutsQuery;
      
      const layouts = await prisma.layout.findMany({
        where: { userId: validatedQuery.userId },
        orderBy: { updatedAt: 'desc' },
      });

      const response = LayoutsListResponseSchema.parse(layouts);
      res.json(response);
    } catch (error) {
      console.error('Error fetching layouts:', error);
      res.status(500).json({ error: 'Failed to fetch layouts' });
    }
  },

  // Get a single layout by ID
  getLayoutById: async (req: Request, res: Response) => {
    try {
      const validatedParams = LayoutPathSchema.parse(req.params) as LayoutPath;
      
      const layout = await prisma.layout.findUnique({
        where: { id: validatedParams.id },
      });

      if (!layout) {
        return res.status(404).json({ error: 'Layout not found' });
      }

      const response = LayoutResponseSchema.parse(layout);
      res.json(response);
    } catch (error) {
      console.error('Error fetching layout:', error);
      res.status(500).json({ error: 'Failed to fetch layout' });
    }
  },

  // Update a layout
  updateLayout: async (req: Request, res: Response) => {
    try {
      const validatedParams = LayoutPathSchema.parse(req.params) as LayoutPath;
      const validatedData = UpdateLayoutSchema.parse(req.body) as UpdateLayoutRequest;

      // Check if layout exists
      const existingLayout = await prisma.layout.findUnique({
        where: { id: validatedParams.id },
      });

      if (!existingLayout) {
        return res.status(404).json({ error: 'Layout not found' });
      }

      const layout = await prisma.layout.update({
        where: { id: validatedParams.id },
        data: {
          ...(validatedData.name && { name: validatedData.name }),
          ...(validatedData.content && { content: validatedData.content }),
        },
      });

      const response = LayoutResponseSchema.parse(layout);
      res.json(response);
    } catch (error) {
      console.error('Error updating layout:', error);
      res.status(500).json({ error: 'Failed to update layout' });
    }
  },

  // Delete a layout
  deleteLayout: async (req: Request, res: Response) => {
    try {
      const validatedParams = LayoutPathSchema.parse(req.params) as LayoutPath;

      // Check if layout exists
      const existingLayout = await prisma.layout.findUnique({
        where: { id: validatedParams.id },
      });

      if (!existingLayout) {
        return res.status(404).json({ error: 'Layout not found' });
      }

      await prisma.layout.delete({
        where: { id: validatedParams.id },
      });

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting layout:', error);
      res.status(500).json({ error: 'Failed to delete layout' });
    }
  },
}; 