import express from 'express';
import { createChat } from '../controllers/chat.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();

router.post('/', protect, createChat);

export default router;
