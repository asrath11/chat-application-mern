import React from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { Button } from '@/components/ui/button';

interface ChatListFooterProps {
    userName: string;
    userEmail: string;
    onLogout: () => void;
}

export const ChatListFooter: React.FC<ChatListFooterProps> = ({
    userName,
    userEmail,
    onLogout,
}) => {
    return (
        <div className='p-4 border-t'>
            <div className='flex items-center gap-3'>
                <Avatar name={userName} />

                <div className='flex-1 min-w-0'>
                    <p className='font-semibold text-primary truncate'>{userName}</p>
                    <p className='text-xs text-muted-foreground truncate'>{userEmail}</p>
                </div>
                <Button className='cursor-pointer' onClick={onLogout}>
                    Log Out
                </Button>
            </div>
        </div>
    );
};
