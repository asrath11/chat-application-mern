import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import User from '@/models/user.model';
import { generateCookie } from '@/utils/generateCookie';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({ name, email, password });

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  generateCookie(res, accessToken, 'accessToken');
  generateCookie(res, refreshToken, 'refreshToken');

  return res.status(201).json({ user });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  generateCookie(res, accessToken, 'accessToken');
  generateCookie(res, refreshToken, 'refreshToken');

  return res.status(200).json({ user });
});

export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token missing' });
    }

    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: 'Refresh token expired or invalid' });
    }

    // Generate new tokens (rotation)
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Save rotated refresh token
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Reset cookies
    generateCookie(res, newAccessToken, 'accessToken');
    generateCookie(res, newRefreshToken, 'refreshToken');

    return res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken: newAccessToken,
    });
  }
);

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded: any = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id);

      if (user) {
        user.refreshToken = undefined;
        await user.save({ validateBeforeSave: false });
      }
    } catch (err) {}
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.status(200).json({ message: 'Logged out successfully' });
});
