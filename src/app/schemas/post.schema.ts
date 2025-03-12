import { z } from 'zod';
import mongoose from 'mongoose';

// Common fields for post validation
const basePostSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  tags: z.array(z.string()).optional(),
});

// Schema for creating a new post
const postCreateSchema = basePostSchema.extend({
  author: z.custom<mongoose.Types.ObjectId>(
    (value) => mongoose.Types.ObjectId.isValid(value),
    { message: 'Invalid author ID' }
  ),
});

// Schema for updating an existing post (optional fields)
export const postUpdateSchema = basePostSchema.partial();

export const postSchema = postCreateSchema;