import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Chat, { IChat } from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import { IMessage } from '@/models/message.model';

interface PopulatedChat extends Omit<IChat, 'participants' | 'latestMessage'> {
  participants: IUser[];
  latestMessage?: IMessage;
}

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

export const allChats = asyncHandler(async (req: Request, res: Response) => {
  const chats = await Chat.find({ participants: req.user?.id })
    .populate('participants', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });

  const formattedChats = (chats as unknown as PopulatedChat[])
    .map((chat) => {
      const user = chat.participants.find(
        (p) => p._id.toString() !== req.user?.id
      );

      if (!user) return null;

      return {
        id: chat._id,
        name: user.name,
        avatar: user.avatar || '',
        lastMessage: chat.latestMessage,
        timestamp: chat.updatedAt,
        unread: 2, //this is for testing purpose
        isOnline: false,
      };
    })
    .filter(Boolean);

  res.status(200).json(formattedChats);
});
