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
      chat: data.chat,
      sender: socket.userId,
      status: 'sent',
    });

    // Populate sender details
    await message.populate('sender', 'name avatar');

    // Cast sender to IUser after population
    const sender = message.sender as unknown as IUser;

    // Emit to all users in the chat room with proper structure
    io.to(data.chat).emit('message:receive', {
      message: {
        _id: message._id.toString(),
        sender: {
          _id: sender._id.toString(),
          name: sender.name,
          avatar: sender.avatar,
        },
        chat: message.chat.toString(),
        content: message.content,
        status: message.status,
        createdAt: message.createdAt.toISOString(),
        updatedAt: message.updatedAt.toISOString(),
      },
      status: 'read',
      chatId: data.chat,
    });
  });

  // Handle message delivery confirmation
  socket.on('message:delivered', async (data: MessageDeliveredPayload) => {
    console.log('message delivered', data);
  });

  // Handle message read confirmation
  socket.on('message:read', async (data: MessageReadPayload) => {
    console.log('message read', data);
  });
};
