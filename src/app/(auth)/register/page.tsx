import { AuthLeftSection, RegisterForm } from '@src/features/auth/auth.index';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Suspense } from 'react';

export const metadata = {
  title: 'Create Account | Story Arc',
  description: 'Join Story Arc and track your reading journey',
};

export default function RegisterPage() {
  return (
    <main className='w-full flex h-screen overflow-hidden'>
      <AuthLeftSection
        title='Join the community of readers.'
        subtitle='Track your progress, discover new favorites, and share your journey with thousands of book enthusiasts around the world.'>
        <div className='flex items-center gap-4'>
          <div className='flex -space-x-4'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='relative w-10 h-10 rounded-full border-2 border-primary overflow-hidden'>
                <Image
                  src={`https://i.pravatar.cc/150?img=${i + 10}`}
                  alt='User Avatar'
                  fill
                  sizes='(min-width: 1024px) 50vw, 100vw'
                  className='object-cover'
                />
              </div>
            ))}
          </div>
          <p className='text-sm font-medium opacity-90'>
            Joined by 10k+ readers this month
          </p>
        </div>
      </AuthLeftSection>
      <Suspense
        fallback={
          <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <RegisterForm />
      </Suspense>
    </main>
  );
}
