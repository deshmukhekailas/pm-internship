import { z } from 'zod';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    role: z.enum(['STUDENT', 'ADMIN']).optional().default('STUDENT'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
});

export const sendOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    type: z.enum(['SIGNUP', 'LOGIN']),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    otp: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
    type: z.enum(['SIGNUP', 'LOGIN']),
  }),
});

export const loginOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    otp: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
  }),
});

export const registerOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email address'),
    otp: z.string().min(6, 'Verification code must be 6 digits').max(6, 'Verification code must be 6 digits'),
    firstName: z.string().min(2, 'First name must be at least 2 characters'),
    lastName: z.string().min(1, 'Last name is required'),
    phone: z.string().optional(),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    credential: z.string().min(10, 'Valid Google credential is required'),
  }),
});
