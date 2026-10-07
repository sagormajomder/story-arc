import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type ILoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      'Must have 1 uppercase, 1 lowercase, 1 number, and 1 symbol'
    ),
  profileImage: z.any().optional(),
});

export type IRegisterFormValues = z.infer<typeof registerSchema>;
