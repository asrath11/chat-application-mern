import React from 'react';
import ChatWindow from './ChatWindow';
import Info from './Info';
import { useChatContext } from '../context';

const ChatContent: React.FC = () => {
    const { isInfoPanelOpen } = useChatContext();

    console.log('ChatContent render - isInfoPanelOpen:', isInfoPanelOpen);

    return (
        <>
            <ChatWindow className={isInfoPanelOpen ? 'w-2/3' : 'w-full'} />
            {isInfoPanelOpen && <Info className='w-1/3 border-l' />}
        </>
    );
};

export default ChatContent;