import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import User from '@/models/user.model';

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await User.find({});
  res.status(200).json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});
