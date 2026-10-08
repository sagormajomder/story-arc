import {
  AuthLeftSection,
  VerifyEmailClient,
} from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: 'Verify Email | Story Arc',
  description: 'Confirm your Story Arc account email address',
};

export default function VerifyEmailPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Confirm your identity.'
        subtitle='Secure your reading journey by confirming your email. We keep your bookmarks, reviews, and progress safe.'
      />
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <VerifyEmailClient />
      </Suspense>
    </main>
  );
}
