import React from 'react';
import { Search, MessageSquarePlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Input } from '@/components/ui/input';

interface ChatListProps {
  activeChatId?: string;
}

// Mock data - replace with real data later
const mockChats = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey! How are you doing?',
    timestamp: '2m ago',
    unread: 2,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: 'See you tomorrow!',
    timestamp: '1h ago',
    unread: 0,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    isOnline: false,
  },
  {
    id: '3',
    name: 'Team Project',
    lastMessage: 'Alice: Great work everyone!',
    timestamp: '3h ago',
    unread: 5,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Team',
    isOnline: false,
  },
];

const ChatList: React.FC<ChatListProps> = ({ activeChatId }) => {
  const { user } = useAuth();

  return (
    <div className='flex flex-col h-screen w-full bg-card'>
      {/* Header */}
      <div className='p-4 border-b'>
        <div className='flex items-center justify-between mb-4'>
          <h1 className='text-2xl font-bold'>Chats</h1>
          <button className='p-2 rounded-full transition-colors'>
            <MessageSquarePlus className='w-6 h-6 bg-muted' />
          </button>
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
        {mockChats.map((chat) => (
          <div
            key={chat.id}
            className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b ${
              activeChatId === chat.id ? 'bg-muted' : ''
            }`}
          >
            {/* Avatar */}
            <div className='relative shrink-0'>
              <img
                src={chat.avatar}
                alt={chat.name}
                className='w-12 h-12 rounded-full'
              />
              {chat.isOnline && (
                <div className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 rounded-full'></div>
              )}
            </div>

            {/* Chat Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-center justify-between mb-1'>
                <h3 className='font-semibold text-primary truncate'>
                  {chat.name}
                </h3>
                <span className='text-xs text-muted-foreground shrink-0 ml-2'>
                  {chat.timestamp}
                </span>
              </div>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-muted-foreground truncate'>
                  {chat.lastMessage}
                </p>
                {chat.unread > 0 && (
                  <span className='shrink-0 ml-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs font-semibold rounded-full'>
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Profile Footer */}
      <div className='p-4 border-t'>
        <div className='flex items-center gap-3'>
          <img
            src={
              user?.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`
            }
            alt={user?.name}
            className='w-10 h-10 rounded-full'
          />
          <div className='flex-1 min-w-0'>
            <p className='font-semibold text-primary truncate'>{user?.name}</p>
            <p className='text-xs text-muted-foreground truncate'>
              {user?.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;
