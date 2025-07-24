// src/app/schemas/user.schema.ts
import { z } from 'zod';

// Schema for user creation
export const userCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(), // Password is optional for OAuth users
});

// Schema for user update
export const userUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  email: z.string().email('Invalid email format').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(), // Optional for updates
  bio: z.string().optional(),
  niche: z.string().optional()
});
