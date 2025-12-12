import { z } from 'zod';
import mongoose from 'mongoose';

// Custom validator for MongoDB ObjectId
const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: 'Invalid ObjectId format',
  });

export const createChatSchema = z.object({
  body: z.object({
    userId: objectIdSchema,
  }),
});

export const createGroupChatSchema = z.object({
  body: z.object({
    name: z
      .string({
        message: 'Group name is required',
      })
      .min(3, 'Group name must be at least 3 characters')
      .max(50, 'Group name must not exceed 50 characters')
      .trim(),
    users: z
      .array(objectIdSchema, {
        message: 'Users array is required',
      })
      .min(1, 'At least one user is required for a group chat')
      .max(50, 'Group cannot have more than 50 participants'),
  }),
});

export const getChatByIdSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
});

export const addParticipantsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    userIds: z
      .array(objectIdSchema, {
        message: 'User IDs array is required',
      })
      .min(1, 'At least one user ID is required')
      .max(20, 'Cannot add more than 20 participants at once'),
  }),
});
export const deleteParticipantsSchema = z.object({
  params: z.object({
    id: objectIdSchema,
  }),
  body: z.object({
    userIds: z
      .array(objectIdSchema, {
        message: 'User IDs array is required',
      })
      .min(1, 'At least one user ID is required')
      .max(20, 'Cannot add more than 20 participants at once'),
  }),
});

export type CreateChatInput = z.infer<typeof createChatSchema>;
export type CreateGroupChatInput = z.infer<typeof createGroupChatSchema>;
export type GetChatByIdInput = z.infer<typeof getChatByIdSchema>;
export type AddParticipantsInput = z.infer<typeof addParticipantsSchema>;
export type DeleteParticipantsInput = z.infer<typeof deleteParticipantsSchema>;
