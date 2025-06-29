import { Router } from 'express';
import { layoutController } from '../controllers/layoutController';
import { validateRequest } from '../middleware/validation';
import { 
  CreateLayoutSchema, 
  UpdateLayoutSchema, 
  LayoutsQuerySchema, 
  LayoutPathSchema 
} from '../validation/layoutSchemas';
import { z } from 'zod';

const router = Router();

// Validation schemas for routes
const createLayoutValidation = z.object({
  body: CreateLayoutSchema,
});

const updateLayoutValidation = z.object({
  body: UpdateLayoutSchema,
  params: LayoutPathSchema,
});

const getLayoutsValidation = z.object({
  query: LayoutsQuerySchema,
});

const getLayoutValidation = z.object({
  params: LayoutPathSchema,
});

const deleteLayoutValidation = z.object({
  params: LayoutPathSchema,
});

// Routes
router.post(
  '/', 
  validateRequest(createLayoutValidation),
  layoutController.createLayout
);

router.get(
  '/', 
  validateRequest(getLayoutsValidation),
  layoutController.getLayoutsByUser
);

router.get(
  '/:id', 
  validateRequest(getLayoutValidation),
  layoutController.getLayoutById
);

router.put(
  '/:id', 
  validateRequest(updateLayoutValidation),
  layoutController.updateLayout
);

router.delete(
  '/:id', 
  validateRequest(deleteLayoutValidation),
  layoutController.deleteLayout
);

export default router; 