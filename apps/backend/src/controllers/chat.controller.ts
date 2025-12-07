import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import Chat from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import Message, { IMessage } from '@/models/message.model';

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

  const fullChat = await Chat.findById(newChat._id).populate(
    'participants',
    '-password'
  );

  res.status(201).json(fullChat);
});

export const allChats = asyncHandler(async (req: Request, res: Response) => {
  const chats = await Chat.find({ participants: req.user?.id })
    .populate<{ participants: IUser[] }>('participants', '-password')
    .populate<{ latestMessage: IMessage }>('latestMessage')
    .sort({ updatedAt: -1 });

  const formattedChats = await Promise.all(
    chats.map(async (chat) => {
      const user = chat.participants.find(
        (p) => p._id.toString() !== req.user?.id
      );

      if (!user) return null;

      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        sender: { $ne: req.user?.id },
        status: { $ne: 'read' },
      });

      return {
        id: chat._id,
        userId: user._id,
        name: user.userName,
        avatar: user.avatar || '',
        lastMessage: chat.latestMessage?.content || '',
        timestamp: chat.updatedAt.toISOString(),
        unread: unreadCount,
        isOnline: user.isOnline,
        lastSeen: user.lastSeen,
      };
    })
  );

  const validChats = formattedChats.filter(Boolean);

  res.status(200).json(validChats);
});

export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const chat = await Chat.findById(req.params.id)
    .populate<{ participants: IUser[] }>('participants', '-password')
    .populate('latestMessage');

  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  const user = chat.participants.find((p) => p._id.toString() !== req.user?.id);

  if (!user) return res.status(404).json({ message: 'User not found' });

  const formattedChat = {
    id: chat._id,
    userId: user._id,
    name: user.userName,
    avatar: user.avatar || '',
    timestamp: chat.updatedAt.toISOString(),
    isOnline: user.isOnline,
    lastSeen: user.lastSeen,
  };

  res.status(200).json(formattedChat);
});
