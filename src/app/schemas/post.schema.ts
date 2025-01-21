import { z } from 'zod';
import mongoose from 'mongoose';

// Zod schema for validating Post data
export const postSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long'),
  content: z.string().min(10, 'Content must be at least 10 characters long'),
  tags: z.array(z.string()).optional(), // Tags are optional
  author: z.string().refine(value => mongoose.Types.ObjectId.isValid(value), 'Invalid author ID'),
});
