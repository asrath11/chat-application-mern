import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Message from '@/models/message.model';
import Chat from '@/models/chat.model';
import type { IUser } from '@/models/user.model';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chat } = req.body;
  if (!content || !chat) {
    return res.status(400).json({ message: 'Content and chat are required' });
  }

  let message = await Message.create({
    sender: req.user?.id,
    content,
    chat,
  });

  message = await (
    await message.populate({
      path: 'chat',
      populate: {
        path: 'participants',
        select: 'name avatar email',
      },
    })
  ).populate({
    path: 'chat',
    populate: {
      path: 'latestMessage',
    },
  });

  await Chat.findByIdAndUpdate(chat, {
    latestMessage: message,
  });

  res.status(201).json(message);
});

export const getAllMessages = asyncHandler(
  async (req: Request, res: Response) => {
    const { chat } = req.query;

    if (!chat) {
      return res.status(400).json({ message: 'Chat is required' });
    }

    const messages = await Message.find({ chat })
      .populate('sender', 'name avatar email')
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((message) => {
      const messageObj = message.toObject();

      const isSender = message.sender.id.toString() === req.user?.id;

      return {
        ...messageObj,
        sender: isSender ? 'me' : 'other',
      };
    });

    res.status(200).json(formattedMessages);
  }
);
