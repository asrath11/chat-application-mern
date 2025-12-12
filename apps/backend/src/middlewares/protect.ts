import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { asyncHandler } from '@/utils/asyncHandler';
import { AuthenticatedUser } from '@/types/express';

export const protect = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const accessToken =
      req.cookies?.accessToken ||
      (req.headers.authorization?.startsWith('Bearer ') &&
        req.headers.authorization?.split(' ')[1]);

    if (!accessToken) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    try {
      const decoded = verifyAccessToken(accessToken);

      if (!decoded || typeof decoded === 'string' || !('id' in decoded)) {
        return res.status(401).json({ message: 'Invalid access token' });
      }

      req.user = decoded as AuthenticatedUser;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Access token expired or invalid' });
    }
  }
);
