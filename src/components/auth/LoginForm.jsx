'use client';

import GoogleLogin from '@/components/auth/GoogleLogin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function LoginForm() {
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
              <p className='text-sm text-destructive'>{errors.email.message}</p>
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
                {...register('password', { required: 'Password is required' })}
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
  );
}
