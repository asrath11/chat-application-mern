// JOIN/LEAVE
import { AuthenticatedSocket } from '../index';
import { Server } from 'socket.io';
import Message from '@/models/message.model';

export const registerChatHandlers = (io: Server, socket: AuthenticatedSocket) => {
  socket.on('chat:join', async ({ chatId }: { chatId: string }) => {
    socket.join(chatId);

    // Mark all undelivered messages as delivered when user joins
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: socket.userId },
        status: 'sent',
      },
      { status: 'delivered' }
    );

    // Notify the sender that messages are now delivered
    io.to(chatId).emit('message:status', {
      chatId,
      status: 'delivered',
    });
  });

  socket.on('chat:leave', ({ chatId }: { chatId: string }) => {
    console.log(`User ${socket.userId} left ${chatId}`);
    socket.leave(chatId);
  });
};
