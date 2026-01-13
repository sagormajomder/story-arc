import Image from 'next/image';

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
        <div className='absolute inset-0 bg-primary/40 mix-blend-multiply' />
      </div>

      <div className='relative z-10 w-full max-w-lg px-12 text-primary-foreground'>
        <div className='flex items-center gap-2 mb-8'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-10 w-10'>
            <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' />
          </svg>
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
