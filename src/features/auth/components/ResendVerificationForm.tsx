'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { authApi } from '@src/features/auth/api/auth.api';
import {
  resendVerificationSchema,
  type IResendVerificationFormValues,
} from '@src/features/auth/schemas/auth.schema';
import { CheckCircle2, Loader2, Mail, MailCheck } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

export function ResendVerificationForm() {
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
  } = useForm<IResendVerificationFormValues>({
    resolver: zodResolver(resendVerificationSchema),
    defaultValues: {
      email: initialEmail,
    },
  });

  useEffect(() => {
    if (initialEmail) {
      setValue('email', initialEmail);
    }
  }, [initialEmail, setValue]);

  // Handle countdown timer for resend cooldown
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const onSubmit = async (data: IResendVerificationFormValues) => {
    if (countdown > 0) {
      toast.info(`Please wait ${countdown}s before requesting again.`);
      return;
    }

    setIsLoading(true);
    try {
      const res = await authApi.resendVerification({ email: data.email });
      setSentEmail(data.email);
      setIsSuccess(true);
      setCountdown(60); // 60s cooldown
      toast.success(res.message || 'Verification email sent!');
    } catch (error: unknown) {
      console.error('Resend verification error:', error);
      const msg =
        error instanceof Error
          ? error.message
          : 'Failed to send verification email. Please try again.';
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
            <MailCheck className='w-8 h-8' />
          </div>

          <div className='space-y-3'>
            <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
              Verification Link Sent
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              If an account with{' '}
              <span className='font-semibold text-foreground'>{sentEmail}</span>{' '}
              exists and is unverified, a fresh verification email has been
              dispatched.
            </p>
          </div>

          <div className='p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground space-y-2 text-left'>
            <div className='flex items-center gap-2 font-medium text-foreground'>
              <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>Next Steps:</span>
            </div>
            <ul className='list-disc list-inside space-y-1 pl-1'>
              <li>Check your email inbox and Spam / Promotions folder</li>
              <li>Click the activation link in the email</li>
              <li>Return to log in with your account</li>
            </ul>
          </div>

          <div className='space-y-3 pt-2'>
            <Button asChild className='w-full h-11 text-base shadow-sm'>
              <Link href='/login'>Go to Login</Link>
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
              Need to use another email?{' '}
              <button
                type='button'
                onClick={() => setIsSuccess(false)}
                className='font-medium text-primary hover:underline'>
                Change email address
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
            Resend Verification
          </h2>
          <p className='text-muted-foreground mt-2 text-sm'>
            Enter your email address and we&apos;ll send you a new verification
            link to activate your Story Arc account.
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
            {countdown > 0
              ? `Wait ${countdown}s`
              : 'Send Verification Email'}
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
            Create new account
          </Link>
        </div>
      </div>
    </div>
  );
}
