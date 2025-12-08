import { Server, Socket } from 'socket.io';

export const registerTypingHandlers = (io: Server, socket: Socket) => {
  socket.on(
    'typing:start',
    (data: { chatId: string; userId: string; isTyping: boolean }) => {
      socket.broadcast.emit('typing:start', data);
    }
  );
  socket.on(
    'typing:stop',
    (data: { chatId: string; userId: string; isTyping: boolean }) => {
      socket.broadcast.emit('typing:stop', data);
    }
  );
};
