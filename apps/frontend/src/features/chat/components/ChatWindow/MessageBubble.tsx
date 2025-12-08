import React from 'react';
import type { Message } from '@chat-app/shared-types';

interface MessageBubbleProps {
    message: Message;
    isMe: boolean;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
    message,
    isMe,
}) => {
    return (
        <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
            <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground'
                    }`}
            >
                <p className='text-sm wrap-break-word'>{message.content}</p>

                <div className='flex items-center justify-end gap-1 mt-1'>
                    <span
                        className={`text-xs ${isMe ? 'text-muted-foreground' : 'text-primary'
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
                        <span className='text-xs'>
                            {message.status === 'read' ? (
                                <span className='text-blue-800'>✓✓</span>
                            ) : message.status === 'delivered' ? (
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
};
