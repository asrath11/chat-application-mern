import { createContext, useContext, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import type {
  ListenEvents,
  EmitEvents,
  MessageReceivePayload,
} from '@chat-app/shared-types';
import { socketService } from '@/services/socket.service';
import { authService } from '@/features/auth/services/auth.service';
import { useAuth } from './AuthContext';
import { useQueryClient } from '@tanstack/react-query';

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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) {
      socketService.disconnect();
      return;
    }

    let active = true;

    const start = async () => {
      try {
        const { accessToken } = await authService.getMe();
        const s = socketService.connect(accessToken);

        if (active) {
          setSocket(s);
        }
      } catch (err) {
        console.error('❌ Failed to init socket:', err);
      }
    };

    start();

    return () => {
      active = false;
      socketService.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [isAuthenticated]);

  /* ------------------------- SOCKET LISTENERS ------------------------- */
  useEffect(() => {
    if (!socket) return;

    // New message receive handler
    const handleNewMessage = (data: MessageReceivePayload) => {
      console.log('📨 message:receive', data);
      // Invalidate chat list to update unread counts
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    };

    // Presence full list
    const handlePresenceList = (users: string[]) => {
      setOnlineUsers(users);
    };

    // Online user (single)
    const handlePresenceOnline = (userId: string) => {
      setOnlineUsers((prev) =>
        prev.includes(userId) ? prev : [...prev, userId]
      );
    };

    // Offline user (single)
    const handlePresenceOffline = (userId: string) => {
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    /* --- register listeners --- */
    socket.on('message:receive', handleNewMessage);
    socket.on('presence:list', handlePresenceList);
    socket.on('presence:online', handlePresenceOnline);
    socket.on('presence:offline', handlePresenceOffline);

    return () => {
      socket.off('message:receive', handleNewMessage);
      socket.off('presence:list', handlePresenceList);
      socket.off('presence:online', handlePresenceOnline);
      socket.off('presence:offline', handlePresenceOffline);

      // Don't reset onlineUsers unless socket actually disconnects
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
  if (!context) throw new Error('useSocket must be used inside SocketProvider');
  return context;
};
