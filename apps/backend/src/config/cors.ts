import { CorsOptions } from 'cors';
import { config } from './index';

export const corsConfig: CorsOptions = {
  origin: [config.clientUrl],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
