import { z } from 'zod';

// Element base schema
const ElementBaseSchema = z.object({
  id: z.string(),
  type: z.enum(['text', 'image', 'button']),
  x: z.number().min(0),
  y: z.number().min(0),
  width: z.number().min(1),
  height: z.number().min(1),
});

// Text element schema
const TextElementSchema = ElementBaseSchema.extend({
  type: z.literal('text'),
  text: z.string(),
  fontSize: z.number().min(1),
  fontFamily: z.string(),
});

// Image element schema
const ImageElementSchema = ElementBaseSchema.extend({
  type: z.literal('image'),
  src: z.string().optional(),
  alt: z.string(),
});

// Button element schema
const ButtonElementSchema = ElementBaseSchema.extend({
  type: z.literal('button'),
  text: z.string(),
});

// Union of all element types
const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ImageElementSchema,
  ButtonElementSchema,
]);

// Layout content schema (array of elements)
const LayoutContentSchema = z.array(ElementSchema);

// Create/Update layout request schema
export const CreateLayoutSchema = z.object({
  name: z.string().min(1).max(255),
  userId: z.string().min(1),
  content: LayoutContentSchema,
});

// Update layout request schema (all fields optional)
export const UpdateLayoutSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  content: LayoutContentSchema.optional(),
});

// Layout response schema
export const LayoutResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string(),
  content: LayoutContentSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Layouts list response schema
export const LayoutsListResponseSchema = z.array(LayoutResponseSchema);

// Query parameters schema
export const LayoutsQuerySchema = z.object({
  userId: z.string().min(1),
});

// Path parameters schema
export const LayoutPathSchema = z.object({
  id: z.string().min(1),
});

// Type exports
export type CreateLayoutRequest = z.infer<typeof CreateLayoutSchema>;
export type UpdateLayoutRequest = z.infer<typeof UpdateLayoutSchema>;
export type LayoutResponse = z.infer<typeof LayoutResponseSchema>;
export type LayoutsListResponse = z.infer<typeof LayoutsListResponseSchema>;
export type LayoutsQuery = z.infer<typeof LayoutsQuerySchema>;
export type LayoutPath = z.infer<typeof LayoutPathSchema>; 