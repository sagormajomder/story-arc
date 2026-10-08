'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { authApi } from '@src/features/auth/api/auth.api';
import {
  forgotPasswordSchema,
  type IForgotPasswordFormValues,
} from '@src/features/auth/schemas/auth.schema';
import { CheckCircle2, KeyRound, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [countdown, setCountdown] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: IForgotPasswordFormValues) => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown}s before requesting again.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email: data.email });
      setSentEmail(data.email);
      setIsSuccess(true);
      setCountdown(60);
      toast.success(res.message || 'Password reset link sent!');
    } catch (error: unknown) {
      console.error('Forgot password error:', error);
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to send reset link. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
        <div className='w-full max-w-md space-y-8 my-auto text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
            <KeyRound className='w-8 h-8' />
          </div>

          <div className='space-y-3'>
            <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
              Check Your Inbox
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              If an account is associated with{' '}
              <span className='font-semibold text-foreground'>{sentEmail}</span>,
              we have sent instructions to reset your password.
            </p>
          </div>

          <div className='p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground space-y-2 text-left'>
            <div className='flex items-center gap-2 font-medium text-foreground'>
              <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>Important:</span>
            </div>
            <ul className='list-disc list-inside space-y-1 pl-1'>
              <li>The reset link will expire in 15 minutes.</li>
              <li>Check your Spam / Junk folder if you do not see it.</li>
              <li>Never share your password reset link with anyone.</li>
            </ul>
          </div>

          <div className='space-y-3 pt-2'>
            <Button asChild className='w-full h-11 text-base shadow-sm'>
              <Link href='/login'>Return to Login</Link>
            </Button>

            <Button
              variant='outline'
              disabled={countdown > 0 || isLoading}
              onClick={() => onSubmit({ email: sentEmail })}
              className='w-full h-11'>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              {countdown > 0
                ? `Resend available in ${countdown}s`
                : 'Send Again'}
            </Button>

            <p className='text-xs text-muted-foreground'>
              Wrong email address?{' '}
              <button
                type='button'
                onClick={() => setIsSuccess(false)}
                className='font-medium text-primary hover:underline'>
                Try another email
              </button>
            </p>
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
            Forgot Password?
          </h2>
          <p className='text-muted-foreground mt-2 text-sm'>
            Enter your email and we will send you a secure link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <div className='relative'>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                className='h-11 bg-card border-input/50 focus-visible:ring-primary/20 pl-10'
                {...register('email')}
              />
              <Mail className='absolute left-3 top-3 h-5 w-5 text-muted-foreground' />
            </div>
            {errors.email && (
              <p className='text-sm text-destructive'>{errors.email.message}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full h-11 text-base shadow-lg shadow-primary/20'
            disabled={isLoading || countdown > 0}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {countdown > 0 ? `Wait ${countdown}s` : 'Send Reset Link'}
          </Button>
        </form>

        <div className='flex items-center justify-between text-sm text-muted-foreground pt-2'>
          <Link
            href='/login'
            className='font-medium text-primary hover:underline transition-colors'>
            &larr; Back to Login
          </Link>

          <Link
            href='/register'
            className='hover:underline hover:text-foreground transition-colors'>
            Don&apos;t have an account? Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
