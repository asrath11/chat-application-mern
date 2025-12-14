import React, { useState, useMemo } from 'react';
import { useAuth } from '@/app/providers/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '@/app/providers/SocketContext';
import { ChatListHeader } from '@/features/chat/components/ChatList/ChatListHeader';
import { ChatListItem } from '@/features/chat/components/ChatList/ChatListItem';
import { ChatListFooter } from '@/features/chat/components/ChatList/ChatListFooter';
import { useChats } from '@/features/hooks';
import { useChatContext } from '@/features/chat/context';
import { ChatListSkeleton } from '@/components/shared/LoadingSkeletons';

const ChatList: React.FC = () => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const { data: chats, isLoading, error } = useChats();
  const { activeChatId } = useChatContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = useMemo(() => {
    if (!chats || !searchQuery.trim()) return chats;

    const query = searchQuery.toLowerCase();
    return chats.filter((chat) => {
      const chatName = chat.name?.toLowerCase() || '';
      return chatName.includes(query);
    });
  }, [chats, searchQuery]);

  return (
    <div className='flex flex-col h-screen w-full bg-card'>
      <ChatListHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <ChatListSkeleton />
        ) : error ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            <div className='text-center'>
              <p className='text-sm'>Error loading chats</p>
              <p className='text-xs mt-1'>Please try refreshing the page</p>
            </div>
          </div>
        ) : filteredChats?.length === 0 ? (
          <div className='flex items-center justify-center h-full text-muted-foreground'>
            <div className='text-center'>
              <p className='text-sm'>
                {searchQuery ? 'No chats found' : 'No chats available'}
              </p>
              <p className='text-xs mt-1'>
                {searchQuery
                  ? 'Try a different search term'
                  : 'Start a conversation to see it here'}
              </p>
            </div>
          </div>
        ) : (
          filteredChats?.map((chat) => {
            const isOnline = chat.userId
              ? onlineUsers.includes(chat.userId)
              : chat.isOnline;
            const isActive = chat.id === activeChatId;

            return (
              <ChatListItem
                key={chat.id}
                chat={chat}
                isOnline={isOnline}
                isActive={isActive}
                onClick={() => navigate(`/chat/${chat.id}`)}
              />
            );
          })
        )}
      </div>

      <ChatListFooter
        userName={user?.name || ''}
        userEmail={user?.email || ''}
        onLogout={logout}
      />
    </div>
  );
};

export default ChatList;
