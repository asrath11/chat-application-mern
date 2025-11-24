import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectDB } from './lib/db';
import authRoute from './routes/auth.route';

const app = express();

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
