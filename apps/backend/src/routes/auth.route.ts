import express from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from '../controllers/auth.controller';
import { protect } from '@/middlewares/protect';
import { validate } from '@/middlewares/validate.middleware';
import { registerSchema, loginSchema } from '@/validations/auth.validation';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);

export default router;
