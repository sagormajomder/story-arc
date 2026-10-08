import { ManageUsersClient } from '@src/features/users/users.index';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Manage Users | Story Arc',
  description: 'Manage roles and accounts for registered readers.',
};

export default function ManageUsersPage() {
  return (
    <Suspense
      fallback={
        <div className='p-8 max-w-7xl mx-auto'>
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-muted rounded w-48' />
            <div className='h-4 bg-muted rounded w-64' />
          </div>
        </div>
      }>
      <ManageUsersClient />
    </Suspense>
  );
}
