export const ROUTES = {
  HOME: '/',
  CHAT: '/chat/:chatId',
  SIGN_IN: '/signin',
  SIGN_UP: '/signup',
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
  },
  CHAT: {
    LIST: '/chat',
    CREATE: '/chat',
    GET: (id: string) => `/chat/${id}`,
    UPDATE: (id: string) => `/chat/${id}`,
    DELETE: (id: string) => `/chat/${id}`,
  },
  MESSAGE: {
    LIST: (chatId: string) => `/message/${chatId}`,
    SEND: '/message',
    DELETE: (id: string) => `/message/${id}`,
  },
  USER: {
    SEARCH: '/user/search',
  },
} as const;
