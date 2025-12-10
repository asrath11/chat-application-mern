import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '@/utils/asyncHandler';
import Chat from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import { IMessage } from '@/models/message.model';
import { formatChatResponse, formatGroupChatResponse } from '@/utils/formatters';

export const createChat = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.body;

  let chat = await Chat.findOne({
    isGroupChat: false,
    participants: { $all: [req.user?.id, userId] },
  })
    .populate('participants', '-password')
    .populate('latestMessage');

  if (chat) return res.status(200).json(chat);

  const newChat = await Chat.create({
    participants: [
      new mongoose.Types.ObjectId(req.user?.id),
      new mongoose.Types.ObjectId(userId),
    ],
  });

  const fullChat = await Chat.findById(newChat._id).populate(
    'participants',
    '-password'
  );

  res.status(201).json(fullChat);
});

export const createGroupChat = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, users } = req.body;

    // Find users by their usernames
    const allParticipants = [new mongoose.Types.ObjectId(req.user?.id), ...users];

    const existingChat = await Chat.findOne({
      isGroupChat: true,
      chatName: name,
      participants: { $all: allParticipants },
    })
      .populate<{ participants: IUser[] }>('participants', '-password')
      .populate<{ latestMessage: IMessage }>('latestMessage');

    if (existingChat) return res.status(200).json(existingChat);

    const newChat = await Chat.create({
      chatName: name,
      participants: allParticipants,
      isGroupChat: true,
      groupAdmin: new mongoose.Types.ObjectId(req.user?.id),
    });

    const fullChat = await Chat.findById(newChat._id).populate(
      'participants',
      '-password'
    );

    res.status(201).json(fullChat);
  }
);

export const getAllChats = asyncHandler(async (req: Request, res: Response) => {
  const chats = await Chat.find({ participants: req.user?.id })
    .populate<{ participants: IUser[] }>('participants', '-password')
    .populate<{ latestMessage: IMessage }>('latestMessage')
    .sort({ updatedAt: -1 });

  const formattedChats = await Promise.all(
    chats.map((chat) => {
      // Use appropriate formatter based on chat type
      if (chat.isGroupChat) {
        return formatGroupChatResponse(chat, req.user?.id as string);
      } else {
        return formatChatResponse(chat, req.user?.id as string);
      }
    })
  );

  const validChats = formattedChats.filter(Boolean);

  res.status(200).json(validChats);
});

export const getAllGroupChats = asyncHandler(
  async (req: Request, res: Response) => {
    const chats = await Chat.find({ isGroupChat: true })
      .populate<{ participants: IUser[] }>('participants', '-password')
      .populate<{ latestMessage: IMessage }>('latestMessage')
      .sort({ updatedAt: -1 });

    const formattedChats = await Promise.all(
      chats.map(async (chat) =>
        formatGroupChatResponse(chat, req.user?.id as string)
      )
    );

    const validChats = formattedChats.filter(Boolean);

    res.status(200).json(validChats);
  }
);
export const getChatById = asyncHandler(async (req: Request, res: Response) => {
  const chat = await Chat.findById(req.params.id)
    .populate<{ participants: IUser[] }>('participants', '-password')
    .populate<{ latestMessage: IMessage }>('latestMessage');

  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  let formattedChat;
  if (chat.isGroupChat) {
    formattedChat = await formatGroupChatResponse(chat, req.user?.id as string);
  } else {
    formattedChat = await formatChatResponse(chat, req.user?.id as string);
  }

  res.status(200).json(formattedChat);
});
