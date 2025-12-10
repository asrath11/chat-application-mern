import React from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { formatDate } from '@/utils/formatters';

interface ChatListItemProps {
    chat: {
        id: string;
        name: string;
        userId?: string;
        isOnline?: boolean;
        lastSeen?: string | Date;
        lastMessage?: string;
        unread?: number;
    };
    isOnline: boolean | undefined;
    isActive: boolean;
    onClick: () => void;
}

export const ChatListItem: React.FC<ChatListItemProps> = ({
    chat,
    isOnline,
    isActive,
    onClick,
}) => {
    return (
        <button
            type='button'
            onClick={onClick}
            className={`w-full flex items-center gap-4 p-4 border-b hover:bg-accent/40 transition-colors text-left ${isActive ? 'bg-accent/60' : ''
                }`}
        >
            <div className='relative'>
                <Avatar name={chat.name} />

                {isOnline && (
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full' />
                )}
            </div>

            <div className='flex-1 min-w-0'>
                <div
                    className={`flex justify-between ${chat.lastMessage ? 'items-start mb-1' : 'items-center'
                        }`}
                >
                    <h3 className='font-semibold text-primary truncate'>{chat.name}</h3>

                    <span className='text-xs text-muted-foreground shrink-0 ml-2'>
                        {isOnline === false && chat.lastSeen
                            ? formatDate(chat.lastSeen)
                            : ''}
                    </span>
                </div>

                {chat.lastMessage && (
                    <div className='flex items-center justify-between'>
                        <p className='text-sm text-muted-foreground truncate'>
                            {chat.lastMessage}
                        </p>

                        {(chat.unread ?? 0) > 0 && (
                            <span className='shrink-0 ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full'>
                                {chat.unread}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </button>
    );
};
