import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';
import { allChats } from '@/services/chat.service';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@/components/common/Avatar';
import { useSocket } from '@/context/SocketContext';
import { ChatInvite } from '@/features/chat/components/ChatInvite';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatters';

interface ChatListProps {
  activeChatId?: string;
}

const ChatList: React.FC<ChatListProps> = ({ activeChatId }) => {
  const { user, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const navigate = useNavigate();
  const {
    data: chats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['chats'],
    queryFn: () => allChats(),
  });

  return (
    <div className='flex flex-col h-screen w-full bg-card'>
      {/* Header */}
      <div className='p-4 border-b'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Chats</h1>
          <ChatInvite />
        </div>

        {/* Search Bar */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5' />
          <Input
            type='text'
            placeholder='Search conversations...'
            className='w-full pl-10 pr-4 py-2'
          />
        </div>
      </div>

      {/* Chat List */}
      <div className='flex-1 overflow-y-auto'>
        {isLoading ? (
          <div className='flex items-center justify-center h-full'>
            Loading chats...
          </div>
        ) : error ? (
          <div className='flex items-center justify-center h-full'>
            Error loading chats
          </div>
        ) : chats?.length === 0 ? (
          <div className='flex items-center justify-center h-full'>
            No chats available
          </div>
        ) : (
          chats?.map((chat) => {
            const isOnline = chat.userId
              ? onlineUsers.includes(chat.userId)
              : chat.isOnline;
            const isActive = chat.id === activeChatId;

            return (
              <button
                key={chat.id}
                type='button'
                onClick={() => navigate(`/chat/${chat.id}`)}
                className={`w-full flex items-center gap-4 p-4 border-b hover:bg-accent/40 transition-colors text-left ${
                  isActive ? 'bg-accent/60' : ''
                }`}
              >
                <div className='relative'>
                  <Avatar name={chat.name} />

                  {isOnline && (
                    <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full' />
                  )}
                </div>

                {/* Chat Info */}
                <div className='flex-1 min-w-0'>
                  {/* Name + Timestamp */}
                  <div
                    className={`flex justify-between ${
                      chat.lastMessage ? 'items-start mb-1' : 'items-center'
                    }`}
                  >
                    <h3 className='font-semibold text-primary truncate'>
                      {chat.name}
                    </h3>

                    <span className='text-xs text-muted-foreground shrink-0 ml-2'>
                      {isOnline === false && chat.lastSeen
                        ? formatDate(chat.lastSeen)
                        : ''}
                    </span>
                  </div>

                  {/* Message + Unread */}
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
          })
        )}
      </div>

      {/* User Profile Footer */}
      <div className='p-4 border-t'>
        <div className='flex items-center gap-3'>
          <Avatar name={user?.name || ''} />

          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-primary truncate'>{user?.name}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {user?.email}
            </p>
          </div>
          <Button className='cursor-pointer' onClick={logout}>
            Log Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
