import express from 'express';
import { allChats, createChat } from '../controllers/chat.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();

router.route('/').post(protect, createChat).get(protect, allChats);

export default router;
