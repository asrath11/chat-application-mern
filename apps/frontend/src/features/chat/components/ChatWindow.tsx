import React, { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSocket } from '@/app/providers/SocketContext';
import type {
  MessageSendPayload,
  MessageReceivePayload,
  Message,
  TypingPayload,
} from '@chat-app/shared-types';
import { formatDate } from '@/utils/formatters';
import { useAuth } from '@/app/providers/AuthContext';
import { Header } from './ChatWindow/Header';
import { MessageList } from './ChatWindow/MessageList';
import { MessageInput } from './ChatWindow/MessageInput';
import { useChat, useMessages } from '@/features/hooks';
import { useChatContext } from '@/features/chat/context';

interface ChatWindowProps {
  className: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ className }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { socket, onlineUsers } = useSocket();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { activeChatId } = useChatContext();

  // Fetch chat
  const { data: chat, isLoading: chatLoading } = useChat(activeChatId || '');

  // Fetch messages
  const { data: messages = [], refetch: refetchMessages } = useMessages(activeChatId || '');

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
    if (!socket || !activeChatId) return;

    socket.emit('chat:join', { chatId: activeChatId });
    socket.emit('chat:read', { chatId: activeChatId });

    queryClient.invalidateQueries({ queryKey: ['chats'] });

    const handleNewMessage = (data: MessageReceivePayload) => {
      if (data.chatId === activeChatId) {
        refetchMessages();
        socket.emit('chat:read', { chatId: activeChatId });
      }
    };

    const handleChatRead = (data: { chatId: string; userId: string }) => {
      if (data.chatId === activeChatId && data.userId !== user?.id) {
        queryClient.setQueryData(['messages', activeChatId], (old: Message[] = []) =>
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
      socket.emit('chat:leave', { chatId: activeChatId });
    };
  }, [socket, activeChatId, user?.id, queryClient, refetchMessages]);

  // Typing events
  useEffect(() => {
    if (!socket || !activeChatId) return;

    const handleTypingStatus = (data: TypingPayload) => {
      if (data.chatId === activeChatId && data.userId !== user?.id) {
        setIsTyping(data.isTyping);
      }
    };

    socket.on('typing:start', handleTypingStatus);
    socket.on('typing:stop', handleTypingStatus);

    return () => {
      socket.off('typing:start', handleTypingStatus);
      socket.off('typing:stop', handleTypingStatus);
    };
  }, [socket, activeChatId, user?.id]);

  // Send message
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChatId) return;

    const payload: MessageSendPayload = {
      content: message,
      chatId: activeChatId,
    };

    socket?.emit('message:send', payload);
    setMessage('');
  };

  // Typing input handler
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMessage(value);

    if (!socket || !user?.id || !activeChatId) return;

    socket.emit('typing:start', { chatId: activeChatId, userId: user.id, isTyping: true });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing:stop', { chatId: activeChatId, userId: user.id, isTyping: false });
    }, 2000);
  };

  if (chatLoading) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p>Loading chat...</p>
      </div>
    );
  }

  const participantIds =
    chat?.participants?.map((p) => (typeof p === 'string' ? p : p._id || p.id)) ||
    [];

  return (
    <div className={`flex flex-col h-screen ${className}`}>
      <Header
        name={chat?.name || ''}
        isGroupChat={chat?.isGroupChat || false}
        participants={participantIds}
        statusText={statusText}
        isOnline={isOnline}
      />

      <MessageList
        isGroupChat={chat?.isGroupChat || false}
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
