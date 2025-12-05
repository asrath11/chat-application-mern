import React, { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getChatById } from '@/services/chat.service';
import { Avatar } from '@/components/common/Avatar';
import { useSocket } from '@/context/SocketContext';
import type {
  MessageSendPayload,
  MessageReceivePayload,
  Message,
} from '@chat-app/shared-types';
import { getAllMessages } from '@/services/message.service';

interface ChatWindowProps {
  chatId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId }) => {
  const [message, setMessage] = useState('');
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { onlineUsers } = useSocket();

  const { socket } = useSocket();

  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => getChatById(chatId),
  });

  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['messages', chatId],
    queryFn: () => getAllMessages(chatId),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    // Join the chat room
    socket.emit('chat:join', { chatId });

    // Listen for incoming messages
    const handleNewMessage = (data: MessageReceivePayload) => {
      console.log('📨 Received message in ChatWindow:', data);
      // Only refetch if the message is for this chat
      if (data.chatId === chatId) {
        refetchMessages();
      }
    };

    socket.on('message:receive', handleNewMessage);

    // Cleanup on unmount or when chatId changes
    return () => {
      socket.emit('chat:leave', { chatId });
      socket.off('message:receive', handleNewMessage);
    };
  }, [socket, chatId, refetchMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    const payload: MessageSendPayload = {
      content: message,
      chat: chatId,
    };

    // Emit via socket (backend should save and broadcast)
    socket?.emit('message:send', payload);

    setMessage('');
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
      {/* Chat Header */}
      <div className='flex items-center justify-between p-4 bg-card border-b'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <Avatar name={chat?.name || ''} />

            {onlineUsers.includes(chat?.userId || '') && (
              <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full'></div>
            )}
          </div>

          <div>
            <h2 className='font-semibold text-gray-900 dark:text-white'>
              {chat?.name}
            </h2>
            <p className='text-xs'>
              {chat?.lastSeen ? new Date(chat.lastSeen).toLocaleString() : ''}
            </p>
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

      {/* Messages Area */}
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages.length === 0 ? (
          <p className='text-center text-muted-foreground'>No messages yet</p>
        ) : (
          messages.map((msg: Message) => {
            const isMe = msg.sender === 'me';

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
                        {msg.status === 'read'
                          ? '✓✓'
                          : msg.status === 'delivered'
                            ? '✓✓'
                            : '✓'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {isTyping && (
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

      {/* Message Input */}
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
            onChange={(e) => setMessage(e.target.value)}
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
