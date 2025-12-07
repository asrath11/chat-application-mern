// Socket Event Types
export type MessageStatus = 'sent' | 'delivered' | 'read';
// Event Payloads
export interface MessageSendPayload {
  content: string;
  chatId: string;
  status?: MessageStatus;
  timestamp?: string;
}

export interface MessageReceivePayload {
  message: {
    _id: string;
    sender: {
      _id: string;
      name: string;
      avatar?: string;
    };
    chat: string;
    content: string;
    status: MessageStatus;
    createdAt: string;
    updatedAt: string;
  };
  chatId: string;
}

export interface MessageDeliveredPayload {
  messageId: string;
}

export interface MessageReadPayload {
  messageId: string;
}

export interface MessageStatusPayload {
  messageId: string;
  status: MessageStatus;
}

export interface TypingPayload {
  userId: string;
  chatId: string;
  isTyping: boolean;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

// Inter-server Events (for scaling with multiple servers)
export interface InterServerEvents {
  ping: () => void;
}

// Socket Data (attached to each socket instance)
export interface SocketData {
  userId: string;
  username: string;
}
// Client -> Server Events
export interface EmitEvents {
  'message:send': (data: MessageSendPayload) => void;
  'message:delivered': (data: MessageDeliveredPayload) => void;
  'message:read': (data: MessageReadPayload) => void;
  'chat:read': (data: { chatId: string }) => void;
  'typing:start': (data: TypingPayload) => void;
  'typing:stop': (data: TypingPayload) => void;
  'presence:online': () => void;
  'presence:offline': () => void;
  'chat:join': (data: { chatId: string }) => void;
  'chat:leave': (data: { chatId: string }) => void;
}

// Server -> Client Events
export interface ListenEvents {
  'message:receive': (data: MessageReceivePayload) => void;
  'message:status': (data: MessageStatusPayload) => void;
  'chat:read': (data: { chatId: string; userId: string }) => void;
  'chat:join': (data: { chatId: string }) => void;
  'chat:leave': (data: { chatId: string }) => void;
  typing: (data: TypingPayload) => void;
  'presence:list': (userIds: string[]) => void;
  'presence:online': (userId: string) => void;
  'presence:offline': (userId: string) => void;
  error: (data: ErrorPayload) => void;
}
