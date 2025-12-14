import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ChatInvite } from '@/features/chat/components/ChatList/ChatInvite';
import { CreateGroupChat } from '@/features/chat/components/ChatList/CreateGroupChat';

interface ChatListHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ChatListHeader: React.FC<ChatListHeaderProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className='p-4 border-b'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-bold'>Chats</h1>
        <div className='space-x-2'>
          <ChatInvite />
          <CreateGroupChat />
        </div>
      </div>

      <div className='relative'>
        <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5' />
        <Input
          type='text'
          placeholder='Search conversations...'
          className='w-full pl-10 pr-4 py-2'
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
