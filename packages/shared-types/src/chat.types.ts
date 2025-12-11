import { User } from './user.types';

export interface IChat {
  chatName?: string;
  chatAvatar?: string;
  isGroupChat: boolean;
  participants: User[] | string[]; // Populated or IDs
  latestMessage?: string; // To be refined with Message type
  groupAdmin?: User | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface BaseChat {
  id: string;
  _id?: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen: string | Date;
  participants?: User[] | string[];
  userId?: string;
  isGroupChat?: boolean;
  groupAdmin?: User | string;
}

export interface ChatResponse extends BaseChat {
  unread?: number;
  lastMessage?: string;
  timestamp: string | Date;
}

export interface GroupChatResponse extends BaseChat {
  chatName: string;
  chatAvatar: string;
  lastMessage: string;
  timestamp: string | Date;
  groupAdmin: User;
  unread: number;
}

export type GetChatByIdResponse = BaseChat;
