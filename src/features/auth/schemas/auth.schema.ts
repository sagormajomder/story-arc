import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ILoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z
    .string()
    .min(3, 'Full Name should be at least 3 characters')
    .max(50, "Full Name can't exceed 50 characters"),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .max(100, "Password can't exceed 100 characters")
    .regex(/[a-z]/, 'Must have at least one lowercase letter')
    .regex(/[A-Z]/, 'Must have at least one uppercase letter')
    .regex(/\d/, 'Must have at least one number')
    .regex(/[^a-zA-Z0-9]/, 'Must have at least one special character'),
  profileImage: z.any().optional(),
});

export type IRegisterFormValues = z.infer<typeof registerSchema>;

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export type IVerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;

export const resendVerificationSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type IResendVerificationFormValues = z.infer<
  typeof resendVerificationSchema
>;

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export type IForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: z
      .string()
      .min(8, 'Must be at least 8 characters')
      .max(100, "Password can't exceed 100 characters")
      .regex(/[a-z]/, 'Must have at least one lowercase letter')
      .regex(/[A-Z]/, 'Must have at least one uppercase letter')
      .regex(/\d/, 'Must have at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Must have at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type IResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
