import React, { useState, useRef, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatById } from '@/features/chat/services/chat.service';
import { useSocket } from '@/app/providers/SocketContext';
import type {
  MessageSendPayload,
  MessageReceivePayload,
  Message,
  TypingPayload,
} from '@chat-app/shared-types';
import { getAllMessages } from '@/features/chat/services/message.service';
import { formatDate } from '@/utils/formatters';
import { useAuth } from '@/app/providers/AuthContext';
import { Header } from './ChatWindow/Header';
import { MessageList } from './ChatWindow/MessageList';
import { MessageInput } from './ChatWindow/MessageInput';

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Fetch chat
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  });

  // Fetch messages
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getAllMessages(chatId),
  });

  // Derived values
  const isOnline = onlineUsers.includes(chat?.userId || '');
  const statusText = isTyping
    ? 'Typing...'
    : isOnline
      ? 'Online'
      : chat?.lastSeen
        ? formatDate(chat.lastSeen)
        : '';

  // Socket event binding for join, read, message, read receipts
  useEffect(() => {
    if (!socket) return;

    socket.emit('chat:join', { chatId });
    socket.emit('chat:read', { chatId });

    queryClient.invalidateQueries({ queryKey: ['chats'] });

    const handleNewMessage = (data: MessageReceivePayload) => {
      if (data.chatId === chatId) {
        refetchMessages();
        socket.emit('chat:read', { chatId });
      }
    };

    const handleChatRead = (data: { chatId: string; userId: string }) => {
      if (data.chatId === chatId && data.userId !== user?.id) {
        queryClient.setQueryData(['messages', chatId], (old: Message[] = []) =>
          old.map((msg) => {
            const senderId =
              typeof msg.sender === 'object' && msg.sender?._id
                ? msg.sender._id
                : msg.sender;

            return senderId === user?.id && msg.status !== 'read'
              ? { ...msg, status: 'read' }
              : msg;
          })
        );
        refetchMessages();
      }
    };

    socket.on('message:receive', handleNewMessage);
    socket.on('chat:read', handleChatRead);

    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('chat:read', handleChatRead);
      socket.emit('chat:leave', { chatId });
    };
  }, [socket, chatId, user?.id, queryClient, refetchMessages]);

  // Typing events
  useEffect(() => {
    if (!socket) return;

    const handleTypingStatus = (data: TypingPayload) => {
      if (data.chatId === chatId && data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('typing:start', handleTypingStatus);
    socket.on('typing:stop', handleTypingStatus);

    return () => {
      socket.off('typing:start', handleTypingStatus);
      socket.off('typing:stop', handleTypingStatus);
    };
  }, [socket, chatId, user?.id]);

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const payload: MessageSendPayload = {
      content: message,
      chatId,
    };

    socket?.emit('message:send', payload);
    setMessage('');
  };

  // Typing input handler
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket || !user?.id) return;

    socket.emit('typing:start', { chatId, userId: user.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { chatId, userId: user.id, isTyping: false });
    }, 2000);
  };

  if (chatLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Loading chat...</p>
      </div>
    );
  }

  return (
    <div className='flex flex-col h-screen w-full'>
      <Header
        name={chat?.name || ''}
        statusText={statusText}
        isOnline={isOnline}
      />

      <MessageList
        messages={messages}
        currentUserId={user?.id}
        isTyping={isTyping}
      />

      <MessageInput
        message={message}
        onMessageChange={handleInput}
        onSend={handleSend}
      />
    </div>
  );
};

export default ChatWindow;
