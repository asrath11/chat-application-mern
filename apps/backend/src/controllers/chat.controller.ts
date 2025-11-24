import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Chat from '@/models/chat.model';

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'User ID is required' });

  let chat = await Chat.findOne({
    isGroupChat: false,
    participants: { $all: [req.user?.id, userId] },
  })
    .populate('participants', '-password')
    .populate('latestMessage');

  if (chat) return res.status(200).json(chat);

  const newChat = await Chat.create({
    participants: [req.user?.id, userId],
  });

  const fullChat = await Chat.findById(newChat._id)
    .populate('participants', '-password')
    .sort({ updatedAt: -1 });

  res.status(201).json(fullChat);
});
