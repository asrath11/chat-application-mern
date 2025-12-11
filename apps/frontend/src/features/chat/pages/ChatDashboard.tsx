import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatList from '@/features/chat/components/ChatList';
import MainContent from '@/features/chat/components/MainContent';
import { ChatProvider, useChatContext } from '@/features/chat/context';

const ChatDashboardContent: React.FC = () => {
  const { chatId } = useParams<{ chatId?: string }>();
  const { setActiveChatId } = useChatContext();

  useEffect(() => {
    setActiveChatId(chatId || null);
  }, [chatId, setActiveChatId]);

  return (
    <div className='flex h-screen bg-card'>
      <div className='md:w-70 border-r'>
        <ChatList />
      </div>
      <MainContent />
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
