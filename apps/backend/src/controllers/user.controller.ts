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
    { userName: 1, avatar: 1, id: '$_id' }
  ).lean();
  res.status(200).json(users);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  res.status(200).json(user);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { userName, avatar } = req.body;


  if (!userName || userName.trim() === '') {
    return res.status(400).json({ message: 'User name is required' });
  }

  const isExist = await User.findOne({
    userName: userName.trim().toLowerCase(),
    _id: { $ne: userId }
  });

  if (isExist) {
    return res.status(400).json({ message: 'User name already exists' });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    {
      userName: userName.trim().toLowerCase(),
      avatar: avatar.trim(),
    },
    { new: true, runValidators: true }
  ).select('-password -refreshToken');

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({
    user: {
      id: user._id.toString(),
      name: user.userName,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    message: 'Profile updated successfully',
  });
});

export const updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(userId).select('+password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  }
);
