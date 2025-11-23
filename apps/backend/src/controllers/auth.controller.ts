import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import User from '@/models/user.model';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = await User.create({ name, email, password });
  return res.status(201).json({ newUser });
});
