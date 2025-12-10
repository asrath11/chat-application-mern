import express from 'express';
import {
  sendMessage,
  getAllMessages,
  updateMessage,
} from '@/controllers/message.controller';
import { protect } from '@/middlewares/protect';
import { validate } from '@/middlewares/validate.middleware';
import {
  sendMessageSchema,
  getAllMessagesSchema,
  updateMessageSchema,
} from '@/validations/message.validation';

const router = express.Router();
router.use(protect);
router
  .route('/')
  .post(validate(sendMessageSchema), sendMessage)
  .get(validate(getAllMessagesSchema), getAllMessages)
  .put(validate(updateMessageSchema), updateMessage);

export default router;
