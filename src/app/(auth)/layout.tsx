import React from 'react';

export interface IAuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: IAuthLayoutProps) {
  return (
    <div
      className='dark min-h-screen bg-background text-foreground'
      style={{ colorScheme: 'dark' }}>
      {children}
    </div>
  );
}
