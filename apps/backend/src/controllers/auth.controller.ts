import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import User from '@/models/user.model';
import { generateCookie } from '@/utils/generateCookie';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '@/utils/jwt';

const formatUserResponse = (user: any) => {
  const userObj = user.toObject();
  return {
    id: userObj._id.toString(),
    email: userObj.email,
    name: userObj.userName,
    avatar: userObj.avatar,
    createdAt: userObj.createdAt,
    updatedAt: userObj.updatedAt,
  };
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create user
  const user = await User.create({ userName, email, password });

  // Generate tokens
  const accessToken = generateAccessToken(user._id.toString());
  const refreshToken = generateRefreshToken(user._id.toString());

  // Save refresh token in DB
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Set cookies
  generateCookie(res, accessToken, 'accessToken', 15 * 60 * 1000); // 15 minutes
  generateCookie(res, refreshToken, 'refreshToken', 7 * 24 * 60 * 60 * 1000); // 7 days

  return res.status(201).json({
    user: formatUserResponse(user),
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

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
  generateCookie(res, accessToken, 'accessToken', 15 * 60 * 1000); // 15 minutes
  generateCookie(res, refreshToken, 'refreshToken', 7 * 24 * 60 * 60 * 1000); // 7 days

  return res.status(200).json({
    user: formatUserResponse(user),
  });
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

    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ message: 'Refresh token expired or invalid' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user._id.toString());
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Update refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    // Set new cookies
    generateCookie(res, newAccessToken, 'accessToken', 15 * 60 * 1000); // 15 minutes
    generateCookie(res, newRefreshToken, 'refreshToken', 7 * 24 * 60 * 60 * 1000); // 7 days

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

  return res.status(200).json({
    user: formatUserResponse(user),
  });
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

  const cookieOptions: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  };

  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);

  return res.status(200).json({ message: 'Logged out successfully' });
});

/**
 * Generate WebSocket token for authenticated user
 */
export const getWebSocketToken = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Generate a short-lived WebSocket token (reusing access token generation)
    const wsToken = generateAccessToken(userId);

    res.json({
      token: wsToken,
      expiresIn: '15m',
      message: 'WebSocket token generated successfully',
    });
  }
);
