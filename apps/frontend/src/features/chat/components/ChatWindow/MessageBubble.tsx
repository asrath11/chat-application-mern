import React from 'react';
import type { Message } from '@chat-app/shared-types';
import { useUsers } from '@/features/hooks';
import { generateRandomColor } from '@/utils';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  isGroupChat: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isMe,
  isGroupChat,
}) => {
  const { data: users } = useUsers();
  const user = users?.find((user) => user.id === message.sender);
  return (
    <div className={`flex mb-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
          isMe
            ? 'bg-primary text-primary-foreground rounded-br-md'
            : 'bg-secondary text-secondary-foreground rounded-bl-md'
        }`}
      >
        {isGroupChat && !isMe && (
          <div
            className='text-xs font-semibold mb-1'
            style={{ color: generateRandomColor(user?.userName || '') }}
          >
            {user?.userName}
          </div>
        )}

        <div className='text-sm whitespace-pre-wrap'>{message.content}</div>

        <div className='flex items-center justify-end gap-1.5 mt-1'>
          <span
            className={`text-[11px] ${
              isMe ? 'text-primary-foreground/60' : 'text-muted-foreground/70'
            }`}
          >
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : ''}
          </span>

          {isMe && (
            <span className='text-xs leading-none'>
              {message.status === 'read' ? (
                <span className='text-blue-400'>✓✓</span>
              ) : message.status === 'delivered' ? (
                <span className='text-primary-foreground/60'>✓✓</span>
              ) : (
                <span className='text-primary-foreground/50'>✓</span>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
