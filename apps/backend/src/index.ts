import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import { initializeSocket } from './socket';
import { config } from './config';
import { corsConfig } from './config/cors';

// Routes
import authRoute from './routes/auth.route';
import chatRoute from './routes/chat.route';
import userRoute from './routes/user.route';
import messageRoute from './routes/message.route';

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = initializeSocket(httpServer);

// Make io accessible in routes if needed
app.set('io', io);

// Connect to database
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsConfig));
app.use(helmet());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoute);
app.use('/api/chats', chatRoute);
app.use('/api/users', userRoute);
app.use('/api/messages', messageRoute);

// Start server
httpServer.listen(config.port, () => {
  console.log(`🚀 Server running on http://localhost:${config.port}`);
  console.log(`🔌 Socket.IO server ready`);
  console.log(`📝 Environment: ${config.nodeEnv}`);
});

// Force restart
