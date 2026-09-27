'use client';

import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { FiAlertTriangle } from 'react-icons/fi';

export default function ForbiddenPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background p-4 text-center'>
      <div className='mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 text-destructive animate-pulse'>
        <FiAlertTriangle className='h-10 w-10' />
      </div>
      <h1 className='mb-2 text-4xl font-bold tracking-tight font-serif text-foreground'>
        Access Denied
      </h1>
      <p className='mb-8 max-w-md text-muted-foreground'>
        You do not have permission to view this page. Please log in with an
        account that has the necessary access rights.
      </p>

      <div className='flex gap-4'>
        <Button variant='outline' asChild>
          <Link href='/'>Go Home</Link>
        </Button>
        <Button
          variant='destructive'
          onClick={() => signOut({ callbackUrl: '/login' })}>
          Logout & Login
        </Button>
      </div>
    </div>
  );
}
