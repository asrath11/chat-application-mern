import axiosInstance from '@/lib/axios';
import type { Message } from '@chat-app/shared-types';

export const sendMessage = async (message: Message) => {
  try {
    const response = await axiosInstance.post('/messages', message);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};

export const getAllMessages = async (chatId: string) => {
  try {
    const response = await axiosInstance.get(`/messages?chat=${chatId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    throw error;
  }
};

export const updateMessage = async (
  messageId: string,
  status: 'read' | 'delivered' | 'sent'
) => {
  try {
    const response = await axiosInstance.put(`/messages`, {
      messageId,
      status,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating message:', error);
    throw error;
  }
};
