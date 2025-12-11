import express from 'express';
import {
  getAllChats,
  createChat,
  getChatById,
  createGroupChat,
  getAllGroupChats,
  addParticipants,
} from '../controllers/chat.controller';
import { protect } from '@/middlewares/protect';
import { validate } from '@/middlewares/validate.middleware';
import {
  createChatSchema,
  createGroupChatSchema,
  getChatByIdSchema,
  addParticipantsSchema,
} from '@/validations/chat.validation';

const router = express.Router();

router.use(protect);
router.route('/').post(validate(createChatSchema), createChat).get(getAllChats);
router
  .route('/group')
  .post(validate(createGroupChatSchema), createGroupChat)
  .get(getAllGroupChats);
router.route('/:id').get(validate(getChatByIdSchema), getChatById);
router.route('/:id/participants').put(validate(addParticipantsSchema), addParticipants);

export default router;
