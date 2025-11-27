import { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type {
  ListenEvents,
  EmitEvents,
  MessageReceivePayload,
} from '@chat-app/shared-types';
import { socketService } from '@/services/socket.service';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/context/AuthContext';

interface SocketContextType {
  socket: Socket<ListenEvents, EmitEvents> | null;
  onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket<ListenEvents, EmitEvents> | null>(
    null
  );
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initSocket = async () => {
      if (!isAuthenticated) {
        socketService.disconnect();
        if (isMounted) {
          setSocket(null);
          setOnlineUsers([]);
        }
        return;
      }

      try {
        const { accessToken } = await authService.getMe();
        const s = socketService.connect(accessToken);
        if (isMounted) {
          setSocket(s);
        }
      } catch (error) {
        console.error('❌ Failed to initialize socket:', error);
      }
    };

    initSocket();

    return () => {
      isMounted = false;
      console.log('🔌 Cleaning up socket connection');
      socketService.disconnect();
    };
  }, [isAuthenticated]);

  // Setup application-level event listeners
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (data: MessageReceivePayload) => {
      console.log('📨 New message received:', data);
    };

    const handlePresenceList = (users: string[]) => {
      setOnlineUsers(users);
    };

    const handlePresenceOnline = (userId: string) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    const handlePresenceOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
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
    socket.on('presence:list', handlePresenceList);
    socket.on('presence:online', handlePresenceOnline);
    socket.on('presence:offline', handlePresenceOffline);
    socket.on('typing', handleTyping);

    // Cleanup listeners on unmount or socket change
    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('presence:list', handlePresenceList);
      socket.off('presence:online', handlePresenceOnline);
      socket.off('presence:offline', handlePresenceOffline);
      socket.off('typing', handleTyping);
      setOnlineUsers([]);
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};
