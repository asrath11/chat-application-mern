import express from 'express';
import { sendMessage, getAllMessages } from '@/controllers/message.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();
router.use(protect);
router.route('/').post(sendMessage).get(getAllMessages);

export default router;
