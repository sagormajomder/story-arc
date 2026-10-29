'use client';

import { Button } from '@src/components/ui/button';
import { GoogleIcon } from '@src/components/icons';
import { useAuth } from '@src/providers';
import { isAdminRole } from '@src/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Loader2 } from 'lucide-react';

export interface GoogleLoginProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

export function GoogleLogin({
  text = 'Continue with Google',
  className = '',
  disabled = false,
}: GoogleLoginProps) {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = useCallback(
    async (accessToken: string) => {
      setIsSubmitting(true);
      try {
        const loggedUser = await googleLogin(accessToken, 'access');
        toast.success('Logged in successfully with Google!');

        const isAdmin = isAdminRole(loggedUser?.role);
        let targetUrl = isAdmin ? '/admin/dashboard' : '/user/library';

        if (callbackUrl && callbackUrl !== '/login') {
          if (isAdmin) {
            if (!callbackUrl.startsWith('/user')) {
              targetUrl = callbackUrl;
            }
          } else {
            if (!callbackUrl.startsWith('/admin')) {
              targetUrl = callbackUrl;
            }
          }
        }

        router.push(targetUrl as Parameters<typeof router.push>[0]);
        router.refresh();
      } catch (err: unknown) {
        console.error('Google Sign-in error:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Google sign in failed';
        toast.error(errorMessage);
      } finally {
        setIsSubmitting(false);
      }
    },
    [googleLogin, router, callbackUrl]
  );

  const handleError = useCallback((err: Error) => {
    console.error('Google Sign-In error:', err);
    toast.error(err.message || 'Google sign in failed');
  }, []);

  const { isLoaded, signInWithGoogle } = useGoogleAuth({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleClick = () => {
    if (!isLoaded || isSubmitting || disabled) return;
    signInWithGoogle();
  };

  return (
    <Button
      variant='outline'
      type='button'
      onClick={handleClick}
      disabled={disabled || isSubmitting || !isLoaded}
      className={`w-full h-11 text-base shadow-xs flex items-center justify-center gap-2.5 transition-all ${className}`}>
      {isSubmitting ? (
        <>
          <Loader2 className='h-4 w-4 animate-spin text-primary' />
          <span>Signing in with Google...</span>
        </>
      ) : (
        <>
          <GoogleIcon className='size-5 shrink-0' />
          <span>{text}</span>
        </>
      )}
    </Button>
  );
}
