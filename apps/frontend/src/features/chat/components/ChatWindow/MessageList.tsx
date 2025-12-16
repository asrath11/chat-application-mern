import React, { useRef, useEffect } from 'react';
import type { Message } from '@chat-app/shared-types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
  isTyping: boolean;
  isGroupChat: boolean;
  currentChatId?: string;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  isTyping,
  isGroupChat = false,
  currentChatId,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex-1 overflow-y-auto p-4 space-y-4 bg-background'>
      {messages.length === 0 ? (
        <p className='text-center text-muted-foreground'>No messages yet</p>
      ) : (
        messages.map((msg: Message) => {
          const senderId =
            typeof msg.sender === 'object' && msg.sender?.id
              ? msg.sender.id
              : msg.sender;

          const isMe = senderId === currentUserId;

          return (
            <MessageBubble
              key={msg.id}
              message={msg}
              isMe={isMe}
              isGroupChat={isGroupChat}
              currentChatId={currentChatId}
            />
          );
        })
      )}

      {isTyping && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </div>
  );
};
