import { z } from 'zod';

export const sendMessageSchema = z.object({
  body: z.object({
    chatId: z.string().min(1, 'Chat ID is required'),
    content: z.string().min(1, 'Message content is required'),
  }),
});

export const getMessagesSchema = z.object({
  params: z.object({
    chatId: z.string(),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});
