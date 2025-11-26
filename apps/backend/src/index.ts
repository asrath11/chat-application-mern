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

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173'],
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);
app.use('/api/user', userRoute);
app.use('/api/message', messageRoute);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 Socket.IO server ready`);
});
