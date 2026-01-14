import Image from 'next/image';
import { FiBook } from 'react-icons/fi';

export default function AuthLeftSection({ title, subtitle, children }) {
  return (
    <div className='hidden lg:flex w-1/2 relative bg-primary/20 items-center justify-center overflow-hidden'>
      <div className='absolute inset-0 z-0'>
        <Image
          src='/auth/login-bg-image.avif'
          alt='Library'
          fill
          sizes='(min-width: 1024px) 50vw, 100vw'
          className='object-cover opacity-60 mix-blend-overlay'
          priority
        />
        <div className='absolute inset-0 bg-black/40 mix-blend-multiply' />
      </div>

      <div className='relative z-10 w-full max-w-lg px-12 text-white'>
        <div className='flex items-center gap-2 mb-8'>
          <FiBook className='text-[2.5rem]' />
          <h1 className='text-3xl font-bold tracking-tight'>Story Arc</h1>
        </div>
        <h2 className='text-5xl font-serif font-medium leading-tight mb-6'>
          {title}
        </h2>
        <p className='text-lg opacity-90 font-light mb-8'>{subtitle}</p>

        {children}
      </div>
    </div>
  );
}
