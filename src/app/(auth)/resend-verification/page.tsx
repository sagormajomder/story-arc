import {
  AuthLeftSection,
  ResendVerificationForm,
} from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: 'Resend Verification | Story Arc',
  description: 'Request a new email verification link for your Story Arc account',
};

export default function ResendVerificationPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Activate your account.'
        subtitle='Cannot find your verification email? No worries — request a new link and get started in seconds.'
      />
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <ResendVerificationForm />
      </Suspense>
    </main>
  );
}
