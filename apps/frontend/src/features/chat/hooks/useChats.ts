import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  allChats,
  getChatById,
  createChat,
  createGroupChat,
  addParticipants,
  deleteParticipants,
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

/**
 * Hook to add participants to an existing group chat
 */
export const useAddParticipants = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userIds }: { chatId: string; userIds: string[] }) =>
      addParticipants(chatId, userIds),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      // Invalidate both the specific chat and the chats list
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to add participants';
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
export const useDeleteParticipants = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ chatId, userIds }: { chatId: string; userIds: string[] }) =>
      deleteParticipants(chatId, userIds),
    onSuccess: (data, variables) => {
      toast.success(data.message);
      // Invalidate both the specific chat and the chats list
      queryClient.invalidateQueries({ queryKey: ['chat', variables.chatId] });
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      options?.onSuccess?.();
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Failed to delete participants';
      toast.error(message);
      options?.onError?.(error);
    },
  });
};
