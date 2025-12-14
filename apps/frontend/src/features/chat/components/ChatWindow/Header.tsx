import React, { useMemo } from 'react';
import { Phone, Video } from 'lucide-react';
import { Avatar } from '@/components/shared/Avatar';
import { useUsers } from '@/features/hooks';
import { ChatDropdown } from './GroupChatDropdown';
import { useChatContext } from '@/features/chat/context';

interface HeaderProps {
  name: string;
  isGroupChat?: boolean;
  participants: string[];
  statusText: string;
  isOnline: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  name,
  participants,
  isGroupChat = false,
  statusText,
  isOnline,
}) => {
  // Fetch all users
  const { data: users = [] } = useUsers();
  const { toggleInfoPanel } = useChatContext();

  // Memoize participant names to avoid recalculating on every render
  const participantNames = useMemo(() => {
    return users
      .filter((user) => participants.includes(user.id))
      .map((user) => user.userName);
  }, [users, participants]);

  return (
    <div className='flex items-center justify-between p-4 bg-card border-b border-border'>
      <div className='flex items-center gap-3'>
        <div className='relative'>
          <Avatar name={name} onClick={toggleInfoPanel} />

          {isOnline && (
            <div
              className='absolute bottom-0 right-0 w-3 h-3 bg-chart-1 border-2 border-card rounded-full'
              aria-label='Online'
            />
          )}
        </div>

        <div className='flex flex-col'>
          <h2 className='font-semibold text-foreground'>{name}</h2>
          <p className='text-xs text-muted-foreground'>{statusText}</p>
          {isGroupChat && participantNames.length > 0 && (
            <p
              className='text-xs text-muted-foreground truncate max-w-[200px]'
              title={participantNames.join(', ')}
            >
              {participantNames.join(', ')}
            </p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        <button
          className='p-2 rounded-full hover:bg-accent transition-colors'
          aria-label='Voice call'
          type='button'
        >
          <Phone className='w-5 h-5' />
        </button>
        <button
          className='p-2 rounded-full hover:bg-accent transition-colors'
          aria-label='Video call'
          type='button'
        >
          <Video className='w-5 h-5' />
        </button>
        <ChatDropdown />
      </div>
    </div>
  );
};
