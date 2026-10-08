'use client';

import { useAuth } from '@src/providers';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { useGoogleAuth } from '../hooks/useGoogleAuth';
import { Loader2 } from 'lucide-react';

export function GoogleLogin() {
  const { googleLogin } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = useCallback(
    async (idToken: string) => {
      setIsSubmitting(true);
      try {
        await googleLogin(idToken);
        toast.success('Logged in successfully with Google!');

        if (callbackUrl && callbackUrl !== '/login') {
          router.push(callbackUrl as any);
        } else {
          router.push('/user/library');
        }
        router.refresh();
      } catch (err: any) {
        console.error('Google Sign-in error:', err);
        toast.error(err.message || 'Google sign in failed');
      } finally {
        setIsSubmitting(false);
      }
    },
    [googleLogin, router, callbackUrl]
  );

  const handleError = useCallback((err: Error) => {
    console.error('Google Sign-In initialization error:', err);
    toast.error('Google Sign-In failed to initialize');
  }, []);

  const { buttonContainerRef } = useGoogleAuth({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  return (
    <div className='w-full'>
      {isSubmitting && (
        <div className='flex items-center justify-center p-3 text-sm text-muted-foreground'>
          <Loader2 className='mr-2 h-4 w-4 animate-spin text-primary' />
          Signing in with Google...
        </div>
      )}
      <div
        ref={buttonContainerRef}
        className={`w-full flex justify-center min-h-[44px] ${
          isSubmitting ? 'opacity-50 pointer-events-none' : ''
        }`}
      />
    </div>
  );
}
