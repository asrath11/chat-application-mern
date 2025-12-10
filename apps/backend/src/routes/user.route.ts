import express from 'express';
import { getAllUsers, getUser } from '../controllers/user.controller';
import { protect } from '@/middlewares/protect';
import { validate } from '@/middlewares/validate.middleware';
import { getUserSchema } from '@/validations/user.validation';

const router = express.Router();

router.use(protect);
router.get('/', getAllUsers);
router.get('/:id', validate(getUserSchema), getUser);

export default router;
