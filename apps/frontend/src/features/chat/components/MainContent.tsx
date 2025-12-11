import React from 'react';
import ChatContent from './ChatContent';
import EmptyState from './EmptyState';
import { useChatContext } from '../context';

const MainContent: React.FC = () => {
    const { activeChatId } = useChatContext();

    return (
        <div className='flex w-full'>
            {activeChatId ? <ChatContent /> : <EmptyState />}
        </div>
    );
};

export default MainContent;