import { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type {
  ListenEvents,
  EmitEvents,
  MessageReceivePayload,
} from '@chat-app/shared-types';
import { socketService } from '@/services/socket.service';
import { authService } from '@/services/auth.service';

interface SocketContextType {
  socket: Socket<ListenEvents, EmitEvents> | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket<ListenEvents, EmitEvents> | null>(
    null
  );

  useEffect(() => {
    const initSocket = async () => {
      try {
        const { accessToken } = await authService.getMe();
        const s = socketService.connect(accessToken);
        setSocket(s);
      } catch (error) {
        console.error('❌ Failed to initialize socket:', error);
      }
    };

    initSocket();

    return () => {
      console.log('🔌 Cleaning up socket connection');
      socketService.disconnect();
    };
  }, []);

  // Setup application-level event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: MessageReceivePayload) => {
      console.log('📨 New message received:', data);
    };

    // Handle user online status
    const handleUserOnline = (userId: string) => {
      console.log('🟢 User online:', userId);
    };

    // Handle user offline status
    const handleUserOffline = (userId: string) => {
      console.log('🔴 User offline:', userId);
    };

    // Handle typing indicators
    const handleTyping = (data: {
      userId: string;
      chatId: string;
      isTyping: boolean;
    }) => {
      console.log('⌨️ Typing event:', data);
    };

    // Register listeners
    socket.on('message:receive', handleNewMessage);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('typing', handleTyping);

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('user_online', handleUserOnline);
      socket.off('user_offline', handleUserOffline);
      socket.off('typing', handleTyping);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
