import { z } from 'zod';

export const createChatSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Chat name is required').optional(),
    participants: z.array(z.string()).min(1, 'At least one participant is required'),
    isGroup: z.boolean().optional(),
  }),
});

export const updateChatSchema = z.object({
  params: z.object({
    chatId: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).optional(),
  }),
});
