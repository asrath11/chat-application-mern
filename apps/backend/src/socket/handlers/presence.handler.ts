import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../index';

const onlineUsers = new Map<string, string>(); // userId -> socketId

export const registerPresenceHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.emit('presence:list', getOnlineUsers());
  handleUserConnect(io, socket);

  socket.on('disconnect', () => {
    handleUserDisconnect(io, socket);
  });
};

export const handleUserConnect = (io: Server, socket: AuthenticatedSocket) => {
  if (socket.userId) {
    onlineUsers.set(socket.userId, socket.id);
    io.emit('presence:online', socket.userId);
  }
};

export const handleUserDisconnect = (io: Server, socket: AuthenticatedSocket) => {
  if (socket.userId) {
    onlineUsers.delete(socket.userId);
    io.emit('presence:offline', socket.userId);
  }
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
