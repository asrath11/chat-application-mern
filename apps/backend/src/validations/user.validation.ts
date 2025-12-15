import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

export const getUserSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export type GetUserInput = z.infer<typeof getUserSchema>;

export const updateProfileSchema = z.object({
  body: z.object({
    userName: z.string().min(1, 'Name is required').trim(),
    avatar: z.string().optional().or(z.literal('')),
  }),
});

export const updatePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;
