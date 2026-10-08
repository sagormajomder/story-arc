'use client';

import { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              logo_alignment?: 'left' | 'center';
              width?: string | number;
              locale?: string;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export interface IUseGoogleAuthOptions {
  onSuccess: (idToken: string) => Promise<void> | void;
  onError?: (error: Error) => void;
}

// Global state to prevent duplicate initialization in React 18/19 StrictMode and SPA navigations
let isGoogleInitialized = false;
let initializedClientId = '';
let activeOnSuccess: ((idToken: string) => Promise<void> | void) | null = null;
let activeOnError: ((error: Error) => void) | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.google?.accounts?.id) return Promise.resolve();

  return new Promise((resolve, reject) => {
    let script = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]'
    );

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    if (window.google?.accounts?.id) {
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

function renderGoogleButton(container: HTMLDivElement) {
  if (!window.google?.accounts?.id) return;

  const containerWidth = container.offsetWidth || container.clientWidth;
  // Google GSI button width must be between 200 and 400 pixels
  const buttonWidth =
    containerWidth && containerWidth >= 200
      ? Math.min(400, Math.floor(containerWidth))
      : typeof window !== 'undefined'
        ? Math.min(400, Math.max(200, Math.floor(window.innerWidth - 64)))
        : 380;

  container.innerHTML = '';
  window.google.accounts.id.renderButton(container, {
    theme: 'outline',
    size: 'large',
    width: buttonWidth,
    text: 'continue_with',
    shape: 'rectangular',
  });
}

export function useGoogleAuth({ onSuccess, onError }: IUseGoogleAuthOptions) {
  const [isLoaded, setIsLoaded] = useState(false);
  const buttonContainerRef = useRef<HTMLDivElement | null>(null);

  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  });

  const clientId =
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
    process.env.GOOGLE_CLIENT_ID ||
    '';

  useEffect(() => {
    if (!clientId) {
      console.warn('Google Client ID is missing in environment variables');
      return;
    }

    const handleSuccessWrapper = (token: string) => onSuccessRef.current(token);
    const handleErrorWrapper = (err: Error) => onErrorRef.current?.(err);

    activeOnSuccess = handleSuccessWrapper;
    activeOnError = handleErrorWrapper;

    let isMounted = true;

    loadGoogleScript()
      .then(() => {
        if (!isMounted || !window.google?.accounts?.id) return;

        setIsLoaded(true);

        // Initialize Google Identity Services only once
        if (!isGoogleInitialized || initializedClientId !== clientId) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              if (response.credential) {
                try {
                  await activeOnSuccess?.(response.credential);
                } catch (err: any) {
                  activeOnError?.(
                    err instanceof Error ? err : new Error(String(err))
                  );
                }
              } else {
                activeOnError?.(
                  new Error('No credential returned from Google')
                );
              }
            },
          });
          isGoogleInitialized = true;
          initializedClientId = clientId;
        }

        if (buttonContainerRef.current) {
          renderGoogleButton(buttonContainerRef.current);
        }
      })
      .catch((err) => {
        console.error('Failed to initialize Google Sign-In:', err);
        onErrorRef.current?.(err);
      });

    return () => {
      isMounted = false;
      if (activeOnSuccess === handleSuccessWrapper) {
        activeOnSuccess = null;
      }
      if (activeOnError === handleErrorWrapper) {
        activeOnError = null;
      }
    };
  }, [clientId]);

  // Re-render button on window resize (e.g., orientation change)
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (buttonContainerRef.current && window.google?.accounts?.id) {
          renderGoogleButton(buttonContainerRef.current);
        }
      }, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return {
    isLoaded,
    buttonContainerRef,
  };
}
