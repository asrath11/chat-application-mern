import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Message from '@/models/message.model';
import Chat from '@/models/chat.model';
import type { IUser } from '@/models/user.model';

export const sendMessage = asyncHandler(async (req: Request, res: Response) => {
  const { content, chat } = req.body;

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

    const messages = await Message.find({
      chat,
      removedFor: { $ne: req.user?.id },
    })
      .populate('sender', 'name avatar email')
      .sort({ createdAt: 1 });

    const formattedMessages = messages.map((message) => {
      const messageObj = message.toObject();
      const sender = messageObj.sender as unknown as IUser;
      return {
        id: messageObj._id.toString(),
        content: messageObj.content,
        chat: messageObj.chat.toString(),
        sender: sender._id.toString(),
        status: messageObj.status,
        timestamp: messageObj.createdAt,
        createdAt: messageObj.createdAt,
        updatedAt: messageObj.updatedAt,
        isForwarded: messageObj.isForwarded || false,
      };
    });

    res.status(200).json(formattedMessages);
  }
);

export const updateMessage = asyncHandler(async (req: Request, res: Response) => {
  const { messageId, status } = req.body;

  const message = await Message.findByIdAndUpdate(
    messageId,
    { status },
    { new: true }
  );

  if (!message) {
    return res.status(404).json({ message: 'Message not found' });
  }

  res.status(200).json(message);
});
