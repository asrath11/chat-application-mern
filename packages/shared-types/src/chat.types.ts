import { User } from './user.types';

export interface IChat {
  chatName?: string;
  isGroupChat: boolean;
  participants: User[] | string[]; // Populated or IDs
  latestMessage?: any; // To be refined with Message type
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
  userId?: string;
}

export interface ChatResponse extends BaseChat {
  unread?: number;
  lastMessage?: string;
  timestamp: string | Date;
}

export type GetChatByIdResponse = BaseChat;
