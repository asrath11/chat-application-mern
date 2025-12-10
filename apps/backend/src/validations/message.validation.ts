import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

export const sendMessageSchema = z.object({
  body: z.object({
    content: z
      .string({
        message: 'Message content is required',
      })
      .min(1, 'Message content cannot be empty')
      .max(5000, 'Message content must not exceed 5000 characters')
      .trim(),
    chat: objectIdSchema,
  }),
});

export const getAllMessagesSchema = z.object({
  query: z.object({
    chat: objectIdSchema,
  }),
});

export const updateMessageSchema = z.object({
  body: z.object({
    messageId: objectIdSchema,
    status: z
      .enum(['sent', 'delivered', 'read'], {
        message: 'Status must be one of: sent, delivered, read',
      })
      .optional(),
  }),
});

export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type GetAllMessagesInput = z.infer<typeof getAllMessagesSchema>;
export type UpdateMessageInput = z.infer<typeof updateMessageSchema>;
