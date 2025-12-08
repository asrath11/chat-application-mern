import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getChatById } from '@/features/chat/services/chat.service';
import { Avatar } from '@/components/shared/Avatar';
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

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      {/* Header */}
      <div className='flex items-center justify-between p-4 bg-card border-b'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Avatar name={chat?.name || ''} />

            {isOnline && (
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full'></div>
            )}
          </div>

          <div>
            <h2 className='font-semibold text-gray-900 dark:text-white'>
              {chat?.name}
            </h2>
            <p className='text-xs'>{statusText}</p>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <button className='p-2 rounded-full transition-colors'>
            <Phone className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-full transition-colors'>
            <Video className='w-5 h-5' />
          </button>
          <button className='p-2 rounded-full transition-colors'>
            <MoreVertical className='w-5 h-5' />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <p className='text-center text-muted-foreground'>No messages yet</p>
        ) : (
          messages.map((msg: Message) => {
            const senderId =
              typeof msg.sender === 'object' && msg.sender?._id
                ? msg.sender._id
                : msg.sender;

            const isMe = senderId === user?.id;

            return (
              <div
                key={msg._id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    isMe
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <p className='text-sm wrap-break-word'>{msg.content}</p>

                  <div className='flex items-center justify-end gap-1 mt-1'>
                    <span
                      className={`text-xs ${
                        isMe ? 'text-muted-foreground' : 'text-primary'
                      }`}
                    >
                      {msg.timestamp
                        ? new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : ''}
                    </span>

                    {isMe && (
                      <span className='text-xs'>
                        {msg.status === 'read' ? (
                          <span className='text-blue-800'>✓✓</span>
                        ) : msg.status === 'delivered' ? (
                          <span>✓✓</span>
                        ) : (
                          <span>✓</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Typing bubble */}
        {isTyping && user?.id !== chat?.userId && (
          <div className='flex justify-start'>
            <div className='rounded-2xl rounded-bl-none px-4 py-3 shadow-sm'>
              <div className='flex gap-1'>
                <div className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className='p-4 border-t dark:border-gray-700'>
        <form onSubmit={handleSend} className='flex items-center gap-2'>
          <button
            type='button'
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          >
            <Smile className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </button>

          <button
            type='button'
            className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors'
          >
            <Paperclip className='w-6 h-6 text-gray-600 dark:text-gray-400' />
          </button>

          <Input
            type='text'
            value={message}
            onChange={handleInput}
            placeholder='Type a message...'
            className='flex-1 px-4 py-2'
          />

          <button type='submit' disabled={!message.trim()} className='p-2'>
            <Send className='w-6 h-6' />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
