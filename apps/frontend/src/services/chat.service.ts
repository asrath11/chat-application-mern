import axiosInstance from '@/lib/axios';

export interface ChatResponse {
  id: string;
  name: string;
  avatar?: string;
  isOnline?: boolean;
  unread?: number;
  lastMessage?: string;
  timestamp: string;
}

export const createChat = async (userId: string): Promise<ChatResponse> => {
  try {
    const response = await axiosInstance.post<ChatResponse>('/chat', {
      userId,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

export const allChats = async (): Promise<ChatResponse[]> => {
  try {
    const response = await axiosInstance.get<ChatResponse[]>('/chat');
    return response.data;
  } catch (error) {
    console.error('Error fetching chats:', error);
    throw error;
  }
};
