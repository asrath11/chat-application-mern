import { Server } from 'socket.io';
import { AuthenticatedSocket } from '../index';
import User from '@/models/user.model';
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const registerPresenceHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  socket.emit('presence:list', getOnlineUsers());
  handleUserConnect(io, socket);

  socket.on('disconnect', async () => {
    await handleUserDisconnect(io, socket);
  });
};

export const handleUserConnect = (io: Server, socket: AuthenticatedSocket) => {
  if (socket.userId) {
    onlineUsers.set(socket.userId, socket.id);
    io.emit('presence:online', socket.userId);
  }
};

export const handleUserDisconnect = async (
  io: Server,
  socket: AuthenticatedSocket
) => {
  if (socket.userId) {
    await User.findByIdAndUpdate(socket.userId, { lastSeen: new Date() });
    onlineUsers.delete(socket.userId);
    io.emit('presence:offline', socket.userId);
  }
};

export const getOnlineUsers = () => {
  return Array.from(onlineUsers.keys());
};
