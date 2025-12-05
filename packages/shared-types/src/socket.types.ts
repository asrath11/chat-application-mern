export interface MessageSendPayload {
  content: string;
  chat: string;
}

export interface MessageDeliveredPayload {
  messageId: string;
  chatId: string;
}

export interface MessageReadPayload {
  messageId: string;
  chatId: string;
}

export interface MessageReceivePayload {
  message: any; // Refine this later with Message type
  status: string;
  chatId: string;
}

export interface ServerToClientEvents {
  'message:receive': (data: MessageReceivePayload) => void;
  typing: (data: { userId: string; chatId: string; isTyping: boolean }) => void;
  'typing:start': (chatId: string) => void;
  'typing:stop': (chatId: string) => void;
  'presence:list': (users: string[]) => void;
  'presence:online': (userId: string) => void;
  'presence:offline': (userId: string) => void;
}

export interface ClientToServerEvents {
  'message:send': (data: MessageSendPayload) => void;
  'message:delivered': (data: MessageDeliveredPayload) => void;
  'message:read': (data: MessageReadPayload) => void;
  'typing:start': (chatId: string) => void;
  'typing:stop': (chatId: string) => void;
  'join:chat': (chatId: string) => void;
  'chat:join': (data: { chatId: string }) => void;
  'chat:leave': (data: { chatId: string }) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}

export type ListenEvents = ClientToServerEvents;
export type EmitEvents = ServerToClientEvents;
