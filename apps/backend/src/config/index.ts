export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/chat-app',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
} as const;
