import express from 'express';
import {
  allChats,
  createChat,
  getChatById,
} from '../controllers/chat.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();

router.route('/').post(protect, createChat).get(protect, allChats);
router.route('/:id').get(protect, getChatById);

export default router;
