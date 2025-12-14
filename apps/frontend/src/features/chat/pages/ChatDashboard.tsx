import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatList from '@/features/chat/components/ChatList';
import ChatContent from '@/features/chat/components/ChatContent';
import EmptyState from '@/features/chat/components/EmptyState';
import { ChatProvider, useChatContext } from '@/features/chat/context';

const ChatDashboardContent: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const { setActiveChatId, activeChatId } = useChatContext();

  useEffect(() => {
    setActiveChatId(chatId || null);
  }, [chatId, setActiveChatId]);

  return (
    <div className='flex h-screen bg-background'>
      <div className='md:w-70 border-r border-border bg-card'>
        <ChatList />
      </div>
      <div className='flex w-full'>
        {activeChatId ? <ChatContent /> : <EmptyState />}
      </div>
    </div>
  );
};

const ChatDashboard: React.FC = () => {
  return (
    <ChatProvider>
      <ChatDashboardContent />
    </ChatProvider>
  );
};

export default ChatDashboard;
