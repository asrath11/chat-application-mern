import axiosInstance from '@/lib/axios';
import type { ChatResponse, GetChatByIdResponse } from '@chat-app/shared-types';

export const createChat = async (userId: string): Promise<ChatResponse> => {
  const response = await axiosInstance.post<ChatResponse>('/chats', { userId });
  return response.data;
};

export const allChats = async (): Promise<ChatResponse[]> => {
  const response = await axiosInstance.get<ChatResponse[]>('/chats');
  return response.data;
};

export const getChatById = async (id: string): Promise<GetChatByIdResponse> => {
  const response = await axiosInstance.get<GetChatByIdResponse>(`/chats/${id}`);
  return response.data;
};
