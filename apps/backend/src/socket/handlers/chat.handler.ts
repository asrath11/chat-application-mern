// JOIN/LEAVE
import { AuthenticatedSocket } from '../index';
import { Server } from 'socket.io';

export const registerChatHandlers = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('chat:join', ({ chatId }: { chatId: string }) => {
    console.log(`User ${socket.userId} joined ${chatId}`);
    socket.join(chatId);
  });
  socket.on('chat:leave', ({ chatId }: { chatId: string }) => {
    console.log(`User ${socket.userId} left ${chatId}`);
    socket.leave(chatId);
  });
};
