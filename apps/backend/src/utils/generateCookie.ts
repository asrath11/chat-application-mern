import { Response } from 'express';

export const generateCookie = (
  res: Response,
  token: string,
  cookieName: string,
  maxAge: number
) => {
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieOptions: any = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge,
    path: '/',
  };
  res.cookie(cookieName, token, cookieOptions);
};
