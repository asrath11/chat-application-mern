import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { asyncHandler } from '@/utils/asyncHandler';

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ') &&
        req.headers.authorization?.split(' ')[1]);

    if (!accessToken) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const decoded = verifyAccessToken(accessToken);

    if (!decoded || typeof decoded === 'string' || !decoded.id) {
      return res.status(403).json({ message: 'Invalid access token' });
    }

    req.user = decoded;

    next();
  }
);
