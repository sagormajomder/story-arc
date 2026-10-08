import {
  AuthLeftSection,
  ForgotPasswordForm,
} from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export const metadata = {
  title: 'Forgot Password | Story Arc',
  description: 'Reset your Story Arc password',
};

export default function ForgotPasswordPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Restore your access.'
        subtitle='Lost your password? No problem. Provide your email and we will send you secure recovery instructions.'
      />
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <ForgotPasswordForm />
      </Suspense>
    </main>
  );
}
