import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { asyncHandler } from '@/utils/asyncHandler';
import Chat, { IChat } from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import Message, { IMessage } from '@/models/message.model';
import { formatChatResponse, formatGroupChatResponse } from '@/utils/formatters';

type PopulatedChat = Omit<IChat, 'participants' | 'latestMessage'> & {
  participants: IUser[];
  latestMessage?: IMessage;
};

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
        return formatGroupChatResponse(chat as unknown as PopulatedChat, req.user?.id as string);
      } else {
        return formatChatResponse(chat as unknown as PopulatedChat, req.user?.id as string);
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
        formatGroupChatResponse(chat as PopulatedChat, req.user?.id as string)
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
    formattedChat = await formatGroupChatResponse(chat as PopulatedChat, req.user?.id as string);
  } else {
    formattedChat = await formatChatResponse(chat as PopulatedChat, req.user?.id as string);
  }

  res.status(200).json(formattedChat);
});

export const addParticipants = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userIds } = req.body;
    const currentUserId = req.user?.id;

    // Find the chat
    const chat = await Chat.findById(id);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if it's a group chat
    if (!chat.isGroupChat) {
      return res
        .status(400)
        .json({ message: 'Cannot add participants to a direct chat' });
    }

    // Check if current user is admin
    if (chat.groupAdmin?.toString() !== currentUserId) {
      return res
        .status(403)
        .json({ message: 'Only group admin can add participants' });
    }

    // Convert userIds to ObjectIds
    const newParticipantIds = userIds.map(
      (userId: string) => new mongoose.Types.ObjectId(userId)
    );

    // Filter out users who are already participants
    const existingParticipantIds = chat.participants.map((p) => p.toString());
    const uniqueNewParticipants = newParticipantIds.filter(
      (newId: mongoose.Types.ObjectId) =>
        !existingParticipantIds.includes(newId.toString())
    );

    if (uniqueNewParticipants.length === 0) {
      return res
        .status(400)
        .json({ message: 'All selected users are already participants' });
    }

    // Add new participants to the chat
    chat.participants.push(...uniqueNewParticipants);
    await chat.save();

    // Return updated chat with populated participants
    const updatedChat = await Chat.findById(id)
      .populate<{ participants: IUser[] }>('participants', '-password')
      .populate<{ latestMessage: IMessage }>('latestMessage');

    const formattedChat = await formatGroupChatResponse(
      updatedChat! as PopulatedChat,
      currentUserId as string
    );

    res.status(200).json({
      message: `Successfully added ${uniqueNewParticipants.length} participant(s)`,
      chat: formattedChat,
    });
  }
);

export const deleteParticipants = asyncHandler(async (req, res) => {
  const { id } = req.params; // chat id
  const { userIds } = req.body; // user ids to remove
  const currentUserId = req.user?.id; // logged in user id

  // 1. Find chat
  const chat = await Chat.findById(id);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  // 2. Must be a group chat
  if (!chat.isGroupChat) {
    return res.status(400).json({ message: 'Cannot remove from direct chat' });
  }

  // 3. Only admin can remove
  if (chat.groupAdmin?.toString() !== currentUserId) {
    return res.status(403).json({ message: 'Only admin can remove users' });
  }

  // 4. Convert userIds -> mongoose ObjectIds
  const idsToRemove = userIds.map(
    (id: string) => new mongoose.Types.ObjectId(id)
  );

  // 5. Remove participants
  chat.participants = chat.participants.filter(
    (participantId: mongoose.Types.ObjectId) =>
      !idsToRemove.some(
        (removeId: mongoose.Types.ObjectId) =>
          removeId.toString() === participantId.toString()
      )
  );

  await chat.save();

  // 6. Return updated chat
  const updatedChat = await Chat.findById(id)
    .populate('participants', '-password')
    .populate('latestMessage');

  return res.status(200).json({
    message: 'Participants removed successfully',
    chat: updatedChat,
  });
});

export const clearChat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUserId = req.user?.id;

  // 1. Find chat
  const chat = await Chat.findById(id);
  if (!chat) return res.status(404).json({ message: 'Chat not found' });

  // 3. Clear chat (Soft delete for user)
  await Message.updateMany(
    { chat: id },
    { $addToSet: { removedFor: currentUserId } }
  );

  // 4. Return updated chat
  const updatedChat = await Chat.findById(id)
    .populate('participants', '-password')
    .populate('latestMessage');

  return res.status(200).json({
    message: 'Chat cleared successfully',
    chat: updatedChat,
  });
});
