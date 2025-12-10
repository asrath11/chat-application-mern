import mongoose, { Document, Schema, model } from 'mongoose';
import { IChat as ISharedChat } from '@chat-app/shared-types';

export interface IChat
  extends Document,
    Omit<ISharedChat, 'participants' | 'latestMessage' | 'groupAdmin'> {
  participants: mongoose.Types.ObjectId[];
  latestMessage?: mongoose.Types.ObjectId;
  groupAdmin?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    chatName: {
      type: String,
      trim: true,
    },
    chatAvatar: {
      type: String,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
    groupAdmin: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Chat = model<IChat>('Chat', chatSchema);

export default Chat;
