import { useQuery } from '@tanstack/react-query';
import { getAllMessages } from '@/features/chat/services/message.service';

/**
 * Hook to fetch all messages for a specific chat
 */
export const useMessages = (chatId: string) => {
  return useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getAllMessages(chatId),
  });
};
