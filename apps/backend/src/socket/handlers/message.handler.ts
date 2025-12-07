import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../index';
import Message from '@/models/message.model';
import { IUser } from '@/models/user.model';
import {
  MessageSendPayload,
  MessageDeliveredPayload,
  MessageReadPayload,
} from '@chat-app/shared-types';

export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  // Handle sending a message
  socket.on('message:send', async (data: MessageSendPayload) => {
    const message = await Message.create({
      content: data.content,
      chat: data.chatId,
      sender: socket.userId,
      status: 'delivered',
    });

    // Populate sender details
    await message.populate('sender', 'name avatar');

    // Cast sender to IUser after population
    const sender = message.sender as unknown as IUser;

    // Emit to all users in the chat room with proper structure
    io.to(data.chatId).emit('message:receive', {
      message: {
        _id: message._id.toString(),
        sender: {
          _id: sender._id.toString(),
          name: sender.userName,
          avatar: sender.avatar,
        },
        chat: message.chat.toString(),
        content: message.content,
        status: message.status,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
      },
      chat: data.chatId,
    });
  });

  // Handle entire chat read
  socket.on('chat:read', async (data: { chatId: string }) => {
    const { chatId } = data;
    if (!socket.userId) return;

    // Update status in DB
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: socket.userId },
        status: { $ne: 'read' },
      },
      { status: 'read' }
    );

    // Notify room
    io.to(chatId).emit('chat:read', {
      chatId,
      userId: socket.userId,
    });
  });
};
