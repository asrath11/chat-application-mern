import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Message from '@/models/message.model';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chat } = req.body;
  if (!content || !chat) {
    return res.status(400).json({ message: 'Content and chat are required' });
  }
  const message = await Message.create({ content, chat, sender: req.user?.id });
  res.status(201).json(message);
});
