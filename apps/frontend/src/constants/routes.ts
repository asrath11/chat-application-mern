export const ROUTES = {
  HOME: '/',
  CHAT: '/chat/:chatId',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
  PROFILE: '/profile',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  CHAT: {
    LIST: '/chats',
    CREATE: '/chats',
    GET: (id: string) => `/chats/${id}`,
    UPDATE: (id: string) => `/chats/${id}`,
    DELETE: (id: string) => `/chats/${id}`,
  },
  MESSAGE: {
    LIST: (chatId: string) => `/messages/${chatId}`,
    SEND: '/messages',
    DELETE: (id: string) => `/messages/${id}`,
  },
  USER: {
    SEARCH: '/users/search',
  },
} as const;
