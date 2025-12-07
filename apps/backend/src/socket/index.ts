import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ListenEvents,
  EmitEvents,
  InterServerEvents,
  SocketData,
} from '@chat-app/shared-types';
import { verifyAccessToken } from '@/utils/jwt';
import { registerPresenceHandlers } from './handlers/presence.handler';
import { registerMessageHandlers } from './handlers/message.handler';
import { registerTypingHandlers } from './handlers/typing.handler';
import { registerChatHandlers } from './handlers/chat.handler';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
}

export const initializeSocket = (httpServer: HTTPServer) => {
  const io = new Server<EmitEvents, ListenEvents, InterServerEvents, SocketData>(
    httpServer,
    {
      cors: {
        origin: ['http://localhost:5173'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    }
  );

  // Authentication middleware
  io.use(async (socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = verifyAccessToken(token);

      if (typeof decoded === 'string' || !decoded.id) {
        return next(new Error('Invalid token'));
      }

      socket.userId = decoded.id;
      socket.data.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId} (${socket.id})`);

    // register event handlers
    registerChatHandlers(io, socket);
    registerMessageHandlers(io, socket);
    registerPresenceHandlers(io, socket);
    registerTypingHandlers(io, socket);
  });

  return io;
};
