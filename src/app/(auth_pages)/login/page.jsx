'use client';

import GoogleLogin from '@/components/auth/GoogleLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async data => {
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    setIsLoading(false);
  };

  return (
    <div className='w-full flex h-screen overflow-hidden'>
      {/* Left Section - Image & Branding */}
      <div className='hidden lg:flex w-1/2 relative bg-primary/20 items-center justify-center overflow-hidden'>
        <div className='absolute inset-0 z-0'>
          <Image
            src={'/auth/login-bg-image.avif'}
            alt='Library'
            width={1000}
            height={1000}
            loading='eager'
            className='w-full h-full object-cover opacity-60 mix-blend-overlay'
          />
          <div className='absolute inset-0 bg-primary/40 mix-blend-multiply' />
        </div>

        <div className='relative z-10 w-full max-w-lg px-12 text-primary-foreground'>
          <div className='flex items-center gap-2 mb-8'>
            {/* Logo Icon */}
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
            Your next chapter starts here.
          </h2>
          <p className='text-lg opacity-90 font-light'>
            Join thousands of readers tracking their journeys and discovering
            their next favorite story.
          </p>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background'>
        <div className='w-full max-w-md space-y-8'>
          <div className='text-center lg:text-left'>
            <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
              Welcome back
            </h2>
            <p className='text-muted-foreground mt-2'>
              Log in to track your reading progress and discover new favorites.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email Address</Label>
              <Input
                id='email'
                type='email'
                placeholder='name@example.com'
                className='h-11 bg-card border-input/50 focus-visible:ring-primary/20'
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
              {errors.email && (
                <p className='text-sm text-destructive'>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password'>Password</Label>
                <Link
                  href='/forgot-password'
                  className='text-sm font-medium text-primary hover:underline hover:text-primary/80 transition-colors'>
                  Forgot password?
                </Link>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Enter your password'
                  className='h-11 bg-card border-input/50 focus-visible:ring-primary/20 pr-10'
                  {...register('password', {
                    required: 'Password is required',
                  })}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors'>
                  {showPassword ? (
                    <EyeOff className='h-5 w-5' />
                  ) : (
                    <Eye className='h-5 w-5' />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className='text-sm text-destructive'>
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type='submit'
              className='w-full h-11 text-base shadow-lg shadow-primary/20'
              disabled={isLoading}>
              {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
              Sign In
            </Button>
          </form>

          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <Separator className='w-full' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-background px-2 text-muted-foreground'>
                Or continue with
              </span>
            </div>
          </div>

          <GoogleLogin />

          <p className='text-center text-sm text-muted-foreground'>
            Don&apos;t have an account?{' '}
            <Link
              href='/register'
              className='font-medium text-primary hover:underline hover:text-primary/80 transition-colors'>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
