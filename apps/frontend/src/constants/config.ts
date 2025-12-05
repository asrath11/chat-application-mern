export const APP_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000',
  APP_NAME: 'Chat Application',
  TOKEN_KEY: 'auth_token',
} as const;
