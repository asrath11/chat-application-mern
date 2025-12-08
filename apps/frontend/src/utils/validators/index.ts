import { z } from 'zod';

export const loginFormSchema = z.object({
  email: z.email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters long',
  }),
});

export const registerFormSchema = z
  .object({
    userName: z.string().min(3, {
      message: 'Name must be at least 3 characters long',
    }),
    email: z.email({
      message: 'Please enter a valid email address',
    }),
    password: z.string().min(6, {
      message: 'Password must be at least 6 characters long',
    }),
    confirmPassword: z.string().min(6, {
      message: 'Confirm Password must be at least 6 characters long',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
