'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@src/components/ui/button';
import { Input } from '@src/components/ui/input';
import { Label } from '@src/components/ui/label';
import { Separator } from '@src/components/ui/separator';
import { useAuth } from '@src/providers';
import {
  Camera,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  registerSchema,
  type IRegisterFormValues,
} from '../schemas/auth.schema';
import { GoogleLogin } from './GoogleLogin';

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');

  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
    },
  });

  const calculateStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    setPasswordStrength(strength);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('profileImage', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: IRegisterFormValues) => {
    setIsLoading(true);

    try {
      const { profileImage } = data;
      let imageUrl = 'https://i.ibb.co.com/fzYGmQj8/avatar-placeholder.gif';

      if (profileImage && profileImage instanceof File) {
        const formData = new FormData();
        formData.append('image', profileImage);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_HOST_KEY}`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const imageData = await res.json();

        if (imageData.success) {
          imageUrl = imageData.data.url;
        } else {
          console.warn('Image upload failed, falling back to placeholder');
        }
      }

      await registerUser({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        profileImage: imageUrl,
      });

      setRegisteredEmail(data.email);
      setIsSuccess(true);
      toast.success(
        'Account created! Please check your email to verify your account.'
      );
    } catch (error: unknown) {
      console.error('Error during registration:', error);
      const msg = error instanceof Error ? error.message : 'Something went wrong during registration';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
        <div className='w-full max-w-md space-y-8 my-auto text-center'>
          <div className='mx-auto w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm'>
            <MailCheck className='w-8 h-8' />
          </div>

          <div className='space-y-3'>
            <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
              Verify Your Email
            </h2>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              We sent a verification link to{' '}
              <span className='font-semibold text-foreground'>
                {registeredEmail}
              </span>
              . Please check your inbox and click the link to activate your
              account.
            </p>
          </div>

          <div className='p-4 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground space-y-2 text-left'>
            <div className='flex items-center gap-2 font-medium text-foreground'>
              <CheckCircle2 className='w-4 h-4 text-emerald-600 dark:text-emerald-400' />
              <span>Next Steps:</span>
            </div>
            <ol className='list-decimal list-inside space-y-1 pl-1'>
              <li>Open your email inbox</li>
              <li>Click the verification link</li>
              <li>Sign in with your new credentials</li>
            </ol>
          </div>

          <div className='space-y-3 pt-2'>
            <Button asChild className='w-full h-11 text-base shadow-sm'>
              <Link href='/login'>Go to Login</Link>
            </Button>

            <p className='text-sm text-muted-foreground'>
              Didn&apos;t receive an email?{' '}
              <Link
                href={`/resend-verification?email=${encodeURIComponent(
                  registeredEmail
                )}`}
                className='font-medium text-primary hover:underline transition-colors'>
                Resend verification email
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='w-full lg:w-1/2 flex items-center justify-center p-8 bg-background overflow-y-auto'>
      <div className='w-full max-w-md space-y-8 my-auto'>
        <div className='text-center lg:text-left'>
          <h2 className='text-3xl font-bold tracking-tight font-serif text-foreground'>
            Create Account
          </h2>
          <p className='text-muted-foreground mt-2'>
            Enter your details to get started with your library.
          </p>
        </div>

        <div className='space-y-4'>
          <Label>Profile Picture</Label>
          <label
            htmlFor='profile-upload'
            className='flex items-center gap-4 border-2 border-dashed border-input p-4 rounded-lg hover:bg-muted/30 transition-colors cursor-pointer group'>
            <div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors overflow-hidden relative'>
              {previewImage ? (
                <Image
                  src={previewImage}
                  alt='Profile Preview'
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  className='w-full h-full object-cover'
                />
              ) : (
                <Camera className='w-6 h-6 text-muted-foreground group-hover:text-primary' />
              )}
            </div>
            <div className='space-y-1'>
              <p className='text-sm font-medium text-primary group-hover:underline'>
                {previewImage ? 'Change photo' : 'Upload photo'}
              </p>
              <p className='text-xs text-muted-foreground'>
                JPG, GIF or PNG. Max size of 2MB.
              </p>
            </div>
            <input
              id='profile-upload'
              type='file'
              accept='image/*'
              className='hidden'
              onChange={handleImageChange}
            />
          </label>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Full Name</Label>
            <Input
              id='fullName'
              placeholder='John Doe'
              className='h-11 bg-card border-input/50 focus-visible:ring-primary/20'
              {...register('fullName')}
            />
            {errors.fullName && (
              <p className='text-sm text-destructive'>
                {errors.fullName.message}
              </p>
            )}
          </div>

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
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Create a password'
                className='h-11 bg-card border-input/50 focus-visible:ring-primary/20 pr-10'
                {...register('password', {
                  onChange: (e) => calculateStrength(e.target.value),
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

            {/* Password Strength Meter */}
            <div className='flex gap-2 h-1 mt-2'>
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={`h-full w-full rounded-full transition-colors duration-300 ${
                    passwordStrength >= level
                      ? passwordStrength <= 2
                        ? 'bg-red-500'
                        : passwordStrength === 3
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className='flex justify-between text-xs text-muted-foreground mt-1'>
              <span>
                At least 8 characters, One Uppercase, One lowercase, One number
                and symbol
              </span>
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
            Create Account
          </Button>
        </form>

        <div className='relative'>
          <div className='absolute inset-0 flex items-center'>
            <Separator className='w-full' />
          </div>
          <div className='relative flex justify-center text-xs uppercase'>
            <span className='bg-background px-2 text-muted-foreground'>
              Or register with
            </span>
          </div>
        </div>

        <GoogleLogin />

        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='font-medium text-primary hover:underline hover:text-primary/80 transition-colors'>
            Log in
          </Link>
        </p>

        <p className='text-center text-xs text-muted-foreground mt-4 px-8'>
          By clicking &quot;Create Account&quot;, you agree to our{' '}
          <span className='underline cursor-pointer'>Terms of Service</span> and{' '}
          <span className='underline cursor-pointer'>Privacy Policy</span>.
        </p>
      </div>
    </div>
  );
}
