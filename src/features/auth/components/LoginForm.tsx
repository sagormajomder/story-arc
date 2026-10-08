'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Separator } from '@src/components/ui/separator';
import { useAuth } from '@src/providers';
import { AlertCircle, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { loginSchema, type ILoginFormValues } from '../schemas/auth.schema';
import { GoogleLogin } from './GoogleLogin';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ILoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: ILoginFormValues) => {
    setIsLoading(true);
    setUnverifiedEmail(null);

    try {
      await login({
        email: data.email,
        password: data.password,
      });

      toast.success('Logged in successfully!');

      if (callbackUrl && callbackUrl !== '/login') {
        router.push(callbackUrl as any);
      } else {
        router.push('/user/library');
      }
      router.refresh();
    } catch (error: unknown) {
      console.error(error);
      const msg =
        error instanceof Error ? error.message : 'Invalid email or password';
      if (msg.toLowerCase().includes('verify your email')) {
        setUnverifiedEmail(data.email);
      }
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  function handleDemoUser() {
    setValue('email', 'user@storyarc.com');
    setValue('password', 'UserNo01%%');
  }

  function handleDemoAdmin() {
    setValue('email', 'admin@storyarc.com');
    setValue('password', 'AdminNo01%%');
  }

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

        {unverifiedEmail && (
          <div className='p-4 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm flex flex-col gap-2'>
            <div className='flex items-center gap-2 font-medium'>
              <AlertCircle className='h-4 w-4' />
              <span>Email Not Verified</span>
            </div>
            <p className='text-xs'>
              Your account needs email verification before you can sign in.
            </p>
            <Link
              href={`/resend-verification?email=${encodeURIComponent(
                unverifiedEmail,
              )}`}
              className='text-xs font-semibold underline hover:opacity-80 transition-opacity'>
              Click here to resend verification link &rarr;
            </Link>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email Address</Label>
            <Input
              id='email'
              type='email'
              placeholder='name@example.com'
              className='h-11 bg-card border-input/50 focus-visible:ring-primary/20'
              {...register('email')}
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
                {...register('password')}
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
          <Button
            variant='outline'
            type='button'
            className='w-full h-11 text-base shadow-primary/20'
            onClick={handleDemoUser}
            disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign In (Demo User)
          </Button>
          <Button
            variant='outline'
            type='button'
            className='w-full h-11 text-base shadow-primary/20'
            onClick={handleDemoAdmin}
            disabled={isLoading}>
            {isLoading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            Sign In (Demo Admin)
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
