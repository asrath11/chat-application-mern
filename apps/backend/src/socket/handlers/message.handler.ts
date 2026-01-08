import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket } from '../index';
import Message from '@/models/message.model';
import Chat from '@/models/chat.model';
import { IUser } from '@/models/user.model';
import { MessageSendPayload } from '@chat-app/shared-types';

export const registerMessageHandlers = (
  io: Server,
  socket: AuthenticatedSocket
) => {
  // Handle sending a message
  socket.on('message:send', async (data: MessageSendPayload) => {
    if (!socket.userId) return;

    // Check if recipient is online and in the chat room
    const message = await Message.create({
      content: data.content,
      chat: data.chatId,
      sender: socket.userId,
      isForwarded: data.isForworded ?? false,
      status: 'sent',
    });

    // Update Chat's latest message
    await Chat.findByIdAndUpdate(data.chatId, {
      latestMessage: message._id,
    });

    // Populate sender details
    await message.populate('sender', 'name avatar');

    // Cast sender to IUser after population
    const sender = message.sender as unknown as IUser;

    // Emit to all users in the chat room with proper structure
    io.to(data.chatId).emit('message:receive', {
      message: {
        id: message._id.toString(),
        sender: {
          id: sender._id.toString(),
          name: sender.userName,
          avatar: sender.avatar,
        },
        chat: message.chat.toString(),
        content: message.content,
        status: message.status,
        timestamp: message.createdAt.toISOString(),
        isForwarded: message.isForwarded,
      },
      chatId: data.chatId,
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
