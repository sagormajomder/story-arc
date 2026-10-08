'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { authApi } from '@src/features/auth/api/auth.api';
import {
  resetPasswordSchema,
  type IResetPasswordFormValues,
} from '@src/features/auth/schemas/auth.schema';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ResetPasswordForm() {
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    let extractedToken = searchParams.get('token');

    if (!extractedToken && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      extractedToken = params.get('token') || hash.replace(/^token=/, '');
    }

    if (extractedToken) {
      queueMicrotask(() => {
        setToken(extractedToken);
        setValue('token', extractedToken);
      });
    }
  }, [searchParams, setValue]);

  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const onSubmit = async (data: IResetPasswordFormValues) => {
    if (!token) {
      toast.error('Missing reset token. Please use the link from your email.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({
        token,
        newPassword: data.newPassword,
      });

      setIsSuccess(true);
      toast.success(res.message || 'Password reset successfully!');
    } catch (error: unknown) {
      console.error('Reset password error:', error);
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to reset password. The link may have expired or is invalid.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && typeof window !== 'undefined' && !window.location.hash) {
    return (
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
        <div className='w-full max-w-md space-y-8 my-auto text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400'>
            <AlertCircle className='w-8 h-8' />
          </div>

          <div className='space-y-3'>
            <h2 className='text-2xl font-bold tracking-tight font-serif text-foreground'>
              Invalid Reset Link
            </h2>
            <p className='text-sm text-muted-foreground leading-relaxed'>
              We could not detect a valid password reset token in this URL.
              Please request a new reset link.
            </p>
          </div>

          <div className='space-y-3 pt-2'>
            <Button asChild className='w-full h-11 text-base shadow-sm'>
              <Link href='/forgot-password'>Request New Reset Link</Link>
            </Button>

            <Button asChild variant='outline' className='w-full h-11'>
              <Link href='/login'>Return to Login</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
        <div className='w-full max-w-md space-y-8 my-auto text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <CheckCircle2 className='w-8 h-8' />
          </div>

          <div className='space-y-3'>
            <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
              Password Reset!
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Your password has been changed successfully. All previous sessions
              have been signed out for security. You can now log in with your new
              password.
            </p>
          </div>

          <div className='pt-2'>
            <Button asChild className='w-full h-11 text-base shadow-sm'>
              <Link href='/login'>Log In with New Password</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
      <div className='w-full max-w-md space-y-8 my-auto'>
        <div className='text-center lg:text-left'>
          <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
            Set New Password
          </h2>
          <p className='text-muted-foreground mt-2 text-sm'>
            Create a strong new password for your Story Arc account.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          {/* New Password */}
          <div className='space-y-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <div className='relative'>
              <Input
                id='newPassword'
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a new password'
                className='h-11 bg-card border-input/50 focus-visible:ring-primary/20 pr-10'
                {...register('newPassword', {
                  onChange: (e) => calculateStrength(e.target.value),
                })}
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors'>
                {showPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>

            {/* Password Strength Meter */}
            <div className='flex gap-2 h-1 mt-2'>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-full w-full rounded-full transition-colors duration-300 ${
                    passwordStrength >= level
                      ? passwordStrength <= 2
                        ? 'bg-red-500'
                        : passwordStrength === 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>
                At least 8 chars, 1 uppercase, 1 lowercase, 1 number & 1 symbol
              </span>
            </div>

            {errors.newPassword && (
              <p className='text-sm text-destructive'>
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm Password</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your new password'
                className='h-11 bg-card border-input/50 focus-visible:ring-primary/20 pr-10'
                {...register('confirmPassword')}
              />
              <button
                type='button'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className='absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors'>
                {showConfirmPassword ? (
                  <EyeOff className='h-5 w-5' />
                ) : (
                  <Eye className='h-5 w-5' />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className='text-sm text-destructive'>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full h-11 text-base shadow-lg shadow-primary/20'
            disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Reset Password
          </Button>
        </form>

        <p className='text-center text-sm text-muted-foreground'>
          Remember your password?{' '}
          <Link
            href='/login'
            className='font-medium text-primary hover:underline transition-colors'>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
