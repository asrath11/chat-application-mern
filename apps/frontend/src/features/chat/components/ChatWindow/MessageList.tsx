import React, { useRef, useEffect } from 'react';
import type { Message } from '@chat-app/shared-types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';

interface MessageListProps {
    messages: Message[];
    currentUserId?: string;
    isTyping: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
    messages,
    currentUserId,
    isTyping,
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className='flex-1 overflow-y-auto p-4 space-y-4'>
            {messages.length === 0 ? (
                <p className='text-center text-muted-foreground'>No messages yet</p>
            ) : (
                messages.map((msg: Message) => {
                    const senderId =
                        typeof msg.sender === 'object' && msg.sender?._id
                            ? msg.sender._id
                            : msg.sender;

                    const isMe = senderId === currentUserId;

                    return <MessageBubble key={msg._id} message={msg} isMe={isMe} />;
                })
            )}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
        </div>
    );
};
