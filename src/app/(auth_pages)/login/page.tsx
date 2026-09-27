import AuthLeftSection from '@/components/auth/AuthLeftSection';
import LoginForm from '@/components/auth/LoginForm';
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
          <div className='flex justify-center items-center w-full lg:w-1/2'>
            Loading...
          </div>
        }>
        <LoginForm />
      </Suspense>
    </main>
  );
}
