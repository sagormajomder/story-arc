'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
              expires_in?: number;
            }) => void;
            error_callback?: (error: { type: string; message?: string }) => void;
            prompt?: string;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

export interface IUseGoogleAuthOptions {
  onSuccess: (accessToken: string) => Promise<void> | void;
  onError?: (error: Error) => void;
}

function loadGoogleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.oauth2) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    );

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.google?.accounts?.oauth2) {
      resolve();
      return;
    }

    const onLoad = () => resolve();
    const onError = () =>
      reject(new Error('Failed to load Google Identity Services script'));

    script.addEventListener('load', onLoad, { once: true });
    script.addEventListener('error', onError, { once: true });
  });
}

export function useGoogleAuth({ onSuccess, onError }: IUseGoogleAuthOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const tokenClientRef = useRef<{
    requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
  } | null>(null);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  useEffect(() => {
    if (!clientId) {
      console.warn(
        'NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing in environment variables',
      );
      return;
    }

    let isMounted = true;

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !window.google?.accounts?.oauth2) return;

        const client = window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'openid email profile',
          callback: async response => {
            if (response.error) {
              const err = new Error(
                response.error_description ||
                  response.error ||
                  'Google sign-in failed',
              );
              onErrorRef.current?.(err);
              return;
            }

            if (response.access_token) {
              try {
                await onSuccessRef.current(response.access_token);
              } catch (err: unknown) {
                onErrorRef.current?.(
                  err instanceof Error ? err : new Error(String(err)),
                );
              }
            } else {
              onErrorRef.current?.(
                new Error('No access token returned from Google'),
              );
            }
          },
          error_callback: error => {
            onErrorRef.current?.(
              new Error(error.message || `Google OAuth error: ${error.type}`),
            );
          },
        });

        tokenClientRef.current = client;
        setIsLoaded(true);
      })
      .catch(err => {
        console.error('Failed to initialize Google Sign-In:', err);
        onErrorRef.current?.(err);
      });

    return () => {
      isMounted = false;
    };
  }, [clientId]);

  const signInWithGoogle = useCallback(() => {
    if (!tokenClientRef.current) {
      onErrorRef.current?.(
        new Error('Google Sign-In is not initialized or still loading'),
      );
      return;
    }

    tokenClientRef.current.requestAccessToken({ prompt: 'select_account' });
  }, []);

  return {
    isLoaded,
    signInWithGoogle,
  };
}
