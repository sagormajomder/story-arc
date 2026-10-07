'use client';

import { SessionProvider } from 'next-auth/react';
import React, { Suspense } from 'react';

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  return (
    <Suspense fallback={null}>
      <SessionProvider>{children}</SessionProvider>
    </Suspense>
  );
}
