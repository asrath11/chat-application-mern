import express from 'express';
import {
  register,
  login,
  logout,
  refreshAccessToken,
  getMe,
} from '../controllers/auth.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);

export default router;
