'use client';

import { Button } from '@src/components/ui/button';
import { authApi } from '@src/features/auth/api/auth.api';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

type VerificationState = 'idle' | 'loading' | 'success' | 'error' | 'no_token';

export function VerifyEmailClient() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<VerificationState>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);
  const attemptedRef = useRef(false);

  useEffect(() => {
    // 1. Try URL search parameter ?token=...
    let extractedToken = searchParams.get('token');

    // 2. Try URL fragment hash #token=...
    if (!extractedToken && typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      extractedToken = params.get('token') || hash.replace(/^token=/, '');
    }

    if (!extractedToken) {
      queueMicrotask(() => setState('no_token'));
      return;
    }

    if (attemptedRef.current) return;
    attemptedRef.current = true;

    queueMicrotask(() => {
      setToken(extractedToken);
      setState('loading');
    });

    authApi
      .verifyEmail({ token: extractedToken })
      .then((res) => {
        setState('success');
        toast.success(res.message || 'Email verified successfully!');
      })
      .catch((err: unknown) => {
        console.error('Verification error:', err);
        setState('error');
        const msg =
          err instanceof Error
            ? err.message
            : 'Verification token is invalid or has expired.';
        setErrorMessage(msg);
        toast.error(msg);
      });
  }, [searchParams]);

  const handleRetry = () => {
    if (!token) return;
    attemptedRef.current = false;
    setState('loading');
    authApi
      .verifyEmail({ token })
      .then((res) => {
        setState('success');
        toast.success(res.message || 'Email verified successfully!');
      })
      .catch((err: unknown) => {
        setState('error');
        const msg =
          err instanceof Error
            ? err.message
            : 'Verification token is invalid or has expired.';
        setErrorMessage(msg);
      });
  };

  return (
    <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
      <div className='w-full max-w-md space-y-8 my-auto text-center'>
        {state === 'loading' && (
          <div className='space-y-6'>
            <div className='mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary'>
              <Loader2 className='w-8 h-8 animate-spin' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold tracking-tight font-serif text-foreground'>
                Verifying Your Email
              </h2>
              <p className='text-sm text-muted-foreground'>
                Please hold on while we validate your verification token...
              </p>
            </div>
          </div>
        )}

        {state === 'success' && (
          <div className='space-y-6'>
            <div className='mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400'>
              <CheckCircle2 className='w-8 h-8' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
                Email Verified!
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                Your email address has been successfully confirmed. You can now
                sign in and enjoy full access to Story Arc.
              </p>
            </div>
            <div className='pt-2'>
              <Button asChild className='w-full h-11 text-base shadow-sm'>
                <Link href='/login'>Proceed to Login</Link>
              </Button>
            </div>
          </div>
        )}

        {state === 'error' && (
          <div className='space-y-6'>
            <div className='mx-auto w-16 h-16 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive'>
              <XCircle className='w-8 h-8' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
                Verification Failed
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                {errorMessage}
              </p>
            </div>

            <div className='space-y-3 pt-2'>
              <Button
                variant='outline'
                onClick={handleRetry}
                className='w-full h-11'>
                <RefreshCw className='mr-2 h-4 w-4' />
                Retry Verification
              </Button>

              <Button asChild className='w-full h-11 text-base shadow-sm'>
                <Link href='/resend-verification'>
                  Request New Verification Link
                </Link>
              </Button>

              <p className='text-sm text-muted-foreground pt-2'>
                Back to{' '}
                <Link
                  href='/login'
                  className='font-medium text-primary hover:underline'>
                  Login
                </Link>
              </p>
            </div>
          </div>
        )}

        {state === 'no_token' && (
          <div className='space-y-6'>
            <div className='mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400'>
              <AlertCircle className='w-8 h-8' />
            </div>
            <div className='space-y-2'>
              <h2 className='text-2xl font-bold tracking-tight font-serif text-foreground'>
                Invalid Verification Link
              </h2>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                We couldn&apos;t find a valid verification token in this URL.
                Please ensure you opened the complete link from your
                verification email.
              </p>
            </div>

            <div className='space-y-3 pt-2'>
              <Button asChild className='w-full h-11 text-base shadow-sm'>
                <Link href='/resend-verification'>
                  <Mail className='mr-2 h-4 w-4' />
                  Resend Verification Email
                </Link>
              </Button>

              <Button asChild variant='outline' className='w-full h-11'>
                <Link href='/login'>Return to Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
