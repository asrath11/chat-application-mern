import express from 'express';
import {
    getAllUsers,
    getUser,
    updateProfile,
    updatePassword
} from '../controllers/user.controller';
import { protect } from '@/middlewares/protect';
import { validate } from '@/middlewares/validate.middleware';
import {
    getUserSchema,
    updateProfileSchema,
    updatePasswordSchema
} from '@/validations/user.validation';

const router = express.Router();

router.use(protect);
router.get('/', getAllUsers);
router.get('/:id', validate(getUserSchema), getUser);
router.put('/profile', validate(updateProfileSchema), updateProfile);
router.put('/password', validate(updatePasswordSchema), updatePassword);

export default router;
