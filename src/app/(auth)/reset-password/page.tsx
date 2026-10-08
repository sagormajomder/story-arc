import {
  AuthLeftSection,
  ResetPasswordForm,
} from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: 'Reset Password | Story Arc',
  description: 'Set a new password for your Story Arc account',
};

export default function ResetPasswordPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Secure your account.'
        subtitle='Choose a strong and unique password to protect your account and preserve your reading collection.'
      />
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
