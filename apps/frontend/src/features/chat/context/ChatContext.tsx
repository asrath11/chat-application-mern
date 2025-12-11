import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface ChatContextType {
    // Current active chat
    activeChatId: string | null;
    setActiveChatId: (chatId: string | null) => void;

    // Info panel visibility
    isInfoPanelOpen: boolean;
    toggleInfoPanel: () => void;
    openInfoPanel: () => void;
    closeInfoPanel: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
    children: ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [activeChatId, setActiveChatId] = useState<string | null>(null);
    const [isInfoPanelOpen, setIsInfoPanelOpen] = useState(false);

    const toggleInfoPanel = () => setIsInfoPanelOpen(prev => !prev);
    const openInfoPanel = () => setIsInfoPanelOpen(true);
    const closeInfoPanel = () => setIsInfoPanelOpen(false);


    const value: ChatContextType = {
        activeChatId,
        setActiveChatId,
        isInfoPanelOpen,
        toggleInfoPanel,
        openInfoPanel,
        closeInfoPanel,
    };

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};