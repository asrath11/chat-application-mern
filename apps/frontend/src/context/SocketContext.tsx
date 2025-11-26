import { createContext, useContext, useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { socketService } from '@/services/socket.service';
import { authService } from '@/services/auth.service';

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

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

    // Handle new messages
    const handleNewMessage = (message: any) => {
      console.log('📨 New message received:', message);
      // You can dispatch to a global state manager here (Redux, Zustand, etc.)
      // or emit a custom event that components can listen to
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
    socket.on('new_message', handleNewMessage);
    socket.on('user_online', handleUserOnline);
    socket.on('user_offline', handleUserOffline);
    socket.on('typing', handleTyping);

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off('new_message', handleNewMessage);
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
