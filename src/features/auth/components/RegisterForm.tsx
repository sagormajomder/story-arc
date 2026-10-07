'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Eye, EyeOff, Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import GoogleLogin from './GoogleLogin';

const registerSchema = z.object({
  name: z.string().min(1, 'Full Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      'Must have 1 uppercase, 1 lowercase, 1 number, and 1 symbol',
    ),
  profileImage: z.any().optional(),
});

export type IRegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IRegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
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
          },
        );

        const imageData = await res.json();

        if (imageData.success) {
          imageUrl = imageData.data.url;
        } else {
          console.error('Image upload failed:', imageData);
          toast.error('Image upload failed');
        }
      }

      const userInfo = {
        name: data.name,
        email: data.email,
        password: data.password,
        profileImage: imageUrl,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userInfo),
        },
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || 'Registration failed');
      }

      if (result.insertedId) {
        toast.success('Registration successful! Logging you in...');

        const loginResult = await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (loginResult?.error) {
          toast.error('Auto-login failed. Please login manually.');
          router.push('/login');
        } else {
          router.push('/user/library');
          router.refresh();
        }
      }
    } catch (error: any) {
      console.error('Error during registration:', error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

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
            <Label htmlFor='name'>Full Name</Label>
            <Input
              id='name'
              placeholder='John Doe'
              className='h-11 bg-card border-input/50 focus-visible:ring-primary/20'
              {...register('name')}
            />
            {errors.name && (
              <p className='text-sm text-destructive'>{errors.name.message}</p>
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
                  onChange: e => calculateStrength(e.target.value),
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
              {[1, 2, 3, 4].map(level => (
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
