import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  allChats,
  getChatById,
  createChat,
  createGroupChat,
} from '@/features/chat/services/chat.service';
import { toast } from 'sonner';

/**
 * Hook to fetch all chats
 */
export const useChats = () => {
  return useQuery({
    queryKey: ['chats'],
    queryFn: allChats,
  });
};

/**
 * Hook to fetch a single chat by ID
 */
export const useChat = (chatId: string) => {
  return useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  });
};

/**
 * Hook to create a new one-on-one chat
 */
export const useCreateChat = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createChat,
    onSuccess: () => {
      toast.success('Chat created');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to create chat';
      toast.error(message);
      options?.onError?.(error);
    },
  });
};

/**
 * Hook to create a new group chat
 */
export const useCreateGroupChat = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, users }: { name: string; users: string[] }) =>
      createGroupChat(name, users),
    onSuccess: () => {
      toast.success('Group chat created successfully!');
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      toast.error('Failed to create group chat');
      options?.onError?.(error);
    },
  });
};
