import { AuthLeftSection, LoginForm } from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Your next chapter starts here.'
        subtitle='Join thousands of readers tracking their journeys and discovering their next favorite story.'
      />
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
