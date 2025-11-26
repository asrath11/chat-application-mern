import axiosInstance from '@/lib/axios';

export interface Message {
  _id?: string;
  content: string;
  chat: string;
  sender?: string | {
    _id: string;
    name: string;
    avatar?: string;
  };
  status: 'delivered' | 'read' | 'sent';
  timestamp: string;
  createdAt?: string;
  updatedAt?: string;
}

export const sendMessage = async (message: Message) => {
  try {
    const response = await axiosInstance.post('/message', message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAllMessages = async (chatId: string) => {
  try {
    const response = await axiosInstance.get(`/message?chat=${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};
