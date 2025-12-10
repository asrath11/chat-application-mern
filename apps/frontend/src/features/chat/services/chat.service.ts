import axiosInstance from '@/services/api/client';
import type {
  ChatResponse,
  GetChatByIdResponse,
  GroupChatResponse,
} from '@chat-app/shared-types';

export const createChat = async (userId: string): Promise<ChatResponse> => {
  const response = await axiosInstance.post<ChatResponse>('/chats', { userId });
  return response.data;
};

export const createGroupChat = async (
  name: string,
  users: string[]
): Promise<GroupChatResponse> => {
  const response = await axiosInstance.post<GroupChatResponse>('/chats/group', {
    name,
    users,
  });
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

export const allGroupChats = async () => {
  const response = await axiosInstance.get('/chats/group');
  return response.data;
};
