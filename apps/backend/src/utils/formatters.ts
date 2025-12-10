// Consider creating a reusable formatter
import { IChat } from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import Message from '@/models/message.model';
import { IMessage } from '@/models/message.model';

type PopulatedChat = Omit<IChat, 'participants' | 'latestMessage'> & {
  participants: IUser[];
  latestMessage?: IMessage;
};

export const formatChatResponse = async (
  chat: PopulatedChat,
  currentUserId: string
) => {
  const user = chat.participants.find((p) => p._id.toString() !== currentUserId);

  if (!user) return null;

  const unreadCount = await Message.countDocuments({
    chat: chat._id,
    sender: { $ne: currentUserId },
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
    isGroupChat: false,
  };
};

export const formatGroupChatResponse = async (
  chat: PopulatedChat,
  currentUserId: string
) => {
  // Count unread messages for this group
  const unreadCount = await Message.countDocuments({
    chat: chat._id,
    sender: { $ne: currentUserId },
    status: { $ne: 'read' },
  });

  return {
    id: chat._id,
    name: chat.chatName,
    avatar: chat.chatAvatar || '',
    memberCount: chat.participants.length,
    participants: chat.participants.map((p) => ({
      id: p._id,
      name: p.userName,
      avatar: p.avatar,
      isOnline: p.isOnline,
    })),
    lastMessage: chat.latestMessage?.content || '',
    timestamp: chat.updatedAt.toISOString(),
    unread: unreadCount,
    isGroupChat: true,
    groupAdmin: chat.groupAdmin,
  };
};
