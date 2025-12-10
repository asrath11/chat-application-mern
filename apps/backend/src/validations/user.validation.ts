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
