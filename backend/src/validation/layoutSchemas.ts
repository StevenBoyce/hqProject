import { z } from 'zod';

// Helper function to sanitize and validate text content
const sanitizeText = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  // Remove HTML entities and dangerous characters
  return text
    .replace(/[&<>"'`=\/]/g, '') // Remove dangerous HTML characters
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Helper function to sanitize layout names - more permissive than regular text
const sanitizeLayoutName = (text: string): string => {
  if (typeof text !== 'string') return '';
  
  // Remove only truly dangerous characters for layout names
  return text
    .replace(/[<>]/g, '') // Remove angle brackets (potential HTML injection)
    .replace(/javascript:/gi, '') // Remove javascript: URLs
    .replace(/data:/gi, '') // Remove data: URLs
    .replace(/vbscript:/gi, '') // Remove vbscript: URLs
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .trim();
};

// Element base schema
const ElementBaseSchema = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(['text', 'image', 'button']),
  x: z.number().min(0).max(10000),
  y: z.number().min(0).max(10000),
  width: z.number().min(1).max(1000),
  height: z.number().min(1).max(1000),
});

// Text element schema
const TextElementSchema = ElementBaseSchema.extend({
  type: z.literal('text'),
  text: z.string().min(1).max(500).transform(sanitizeText), // Sanitized and length limited
  fontSize: z.number().min(8).max(72), // Reasonable font size range
  fontFamily: z.string().min(1).max(50),
});

// Image element schema
const ImageElementSchema = ElementBaseSchema.extend({
  type: z.literal('image'),
  src: z.string().optional().or(z.literal('')), // Allow empty strings or optional URLs
  alt: z.string().min(1).max(200).transform(sanitizeText), // Sanitized alt text
});

// Button element schema
const ButtonElementSchema = ElementBaseSchema.extend({
  type: z.literal('button'),
  text: z.string().min(1).max(100).transform(sanitizeText), // Sanitized and length limited
});

// Union of all element types
const ElementSchema = z.discriminatedUnion('type', [
  TextElementSchema,
  ImageElementSchema,
  ButtonElementSchema,
]);

// Layout content schema (array of elements)
const LayoutContentSchema = z.array(ElementSchema).max(100); // Limit number of elements

// Create/Update layout request schema
export const CreateLayoutSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeLayoutName), // Sanitized layout name
  userId: z.string().min(1).max(100),
  content: LayoutContentSchema,
});

// Update layout request schema (all fields optional)
export const UpdateLayoutSchema = z.object({
  name: z.string().min(1).max(100).transform(sanitizeLayoutName).optional(), // Sanitized layout name
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
  userId: z.string().min(1).max(100),
});

// Path parameters schema
export const LayoutPathSchema = z.object({
  id: z.string().min(1).max(100),
});

// Type exports
export type CreateLayoutRequest = z.infer<typeof CreateLayoutSchema>;
export type UpdateLayoutRequest = z.infer<typeof UpdateLayoutSchema>;
export type LayoutResponse = z.infer<typeof LayoutResponseSchema>;
export type LayoutsListResponse = z.infer<typeof LayoutsListResponseSchema>;
export type LayoutsQuery = z.infer<typeof LayoutsQuerySchema>;
export type LayoutPath = z.infer<typeof LayoutPathSchema>; 