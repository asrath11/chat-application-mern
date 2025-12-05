import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import User from '@/models/user.model';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const currentUserId = req.user?.id;

  if (!currentUserId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const users = await User.find(
    { _id: { $ne: currentUserId } },
    { userName: 1, _id: 0, avatar: 1 }
  ).lean();

  res.status(200).json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});
