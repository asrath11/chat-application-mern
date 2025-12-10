import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    userName: z
      .string({
        message: 'Username is required',
      })
      .min(3, 'Username must be at least 3 characters')
      .max(30, 'Username must not exceed 30 characters')
      .trim(),

    email: z
      .string({
        message: 'Email is required',
      })
      .toLowerCase()
      .trim(),

    password: z
      .string({
        message: 'Password is required',
      })
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must not exceed 100 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        message: 'Email is required',
      })
      .toLowerCase()
      .trim(),

    password: z
      .string({
        message: 'Password is required',
      })
      .min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
