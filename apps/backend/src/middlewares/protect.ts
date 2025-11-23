import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  let decoded: any;
  try {
    decoded = verifyAccessToken(accessToken);
  } catch (err) {
    return res.status(403).json({ message: 'Invalid access token' });
  }

  req.user = decoded;
  next();
};
