import { Response } from 'express';

export const generateCookie = (
  res: Response,
  token: string,
  cookieName: string
) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
  });
};
