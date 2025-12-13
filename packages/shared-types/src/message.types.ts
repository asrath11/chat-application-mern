import type { User } from './user.types';
import type { IChat } from './chat.types';

export interface IMessage {
  sender: User | string;
  content: string;
  chat: IChat | string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Message {
  _id?: string;
  id?: string;
  content: string;
  chat: string;
  sender?:
  | string
  | {
    _id: string;
    name: string;
    avatar?: string;
  };
  status: 'delivered' | 'read' | 'sent';
  timestamp: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
