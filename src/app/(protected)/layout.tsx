import { Footer } from '@src/components/layouts/Footer';
import { Header } from '@src/components/layouts/Header';
import React from 'react';

export interface ILoggedLayoutProps {
  children: React.ReactNode;
}

export default function LoggedLayout({ children }: ILoggedLayoutProps) {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] min-h-dvh'>
      <Header />
      <main className='min-w-0'>{children}</main>
      <Footer />
    </div>
  );
}
