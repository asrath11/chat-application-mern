import express from 'express';
import { getAllUsers } from '../controllers/user.controller';
import { protect } from '@/middlewares/protect';

const router = express.Router();

router.use(protect)
router.get('/', getAllUsers);

export default router;
