import axiosInstance from '@/lib/axios';

export interface BaseChat {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen: string;
  userId?: string;
}

export interface ChatResponse extends BaseChat {
  unread?: number;
  lastMessage?: string;
  timestamp: string;
}

export type GetChatByIdResponse = BaseChat;

export const createChat = async (userId: string): Promise<ChatResponse> => {
  const response = await axiosInstance.post<ChatResponse>('/chat', { userId });
  return response.data;
};

export const allChats = async (): Promise<ChatResponse[]> => {
  const response = await axiosInstance.get<ChatResponse[]>('/chat');
  return response.data;
};

export const getChatById = async (id: string): Promise<GetChatByIdResponse> => {
  const response = await axiosInstance.get<GetChatByIdResponse>(`/chat/${id}`);
  return response.data;
};
