import mongoose, { Document, model, Schema } from 'mongoose';
import { IMessage as ISharedMessage } from '@chat-app/shared-types';
import { type } from 'os';

export interface IMessage
  extends Document,
  Omit<ISharedMessage, 'sender' | 'chat'> {
  sender: mongoose.Types.ObjectId;
  chat: mongoose.Types.ObjectId;
  removedFor: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  isForwarded: boolean
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent',
    },
    isForwarded: {
      type: Boolean
    },
    removedFor: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Message = model<IMessage>('Message', messageSchema);

export default Message;
