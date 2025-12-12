import { Response } from 'express';

export const generateCookie = (
  res: Response,
  token: string,
  cookieName: string,
  maxAge: number
) => {
  res.cookie(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
  });
};
