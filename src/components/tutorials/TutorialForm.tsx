'use client';

import { Button } from '@/components/ui/button';
import { ITutorial } from '@/types/tutorial';
import { Upload, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

export const CATEGORIES = [
  'Getting Started',
  'Reviews',
  'Library Management',
  'Reading Tips',
  'Strategy',
  'Community',
] as const;

const tutorialSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  url: z
    .string()
    .min(1, 'URL is required')
    .regex(
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/,
      'Invalid YouTube URL'
    ),
  category: z.string().min(1, 'Category is required'),
});

export type ITutorialFormValues = z.infer<typeof tutorialSchema>;

export interface ITutorialFormProps {
  editingTutorial?: (ITutorial & { videoId?: string }) | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

export default function TutorialForm({
  editingTutorial,
  onCancel,
  onSuccess,
}: ITutorialFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ITutorialFormValues>({
    resolver: zodResolver(tutorialSchema),
    defaultValues: {
      title: '',
      url: '',
      category: CATEGORIES[0],
    },
  });

  useEffect(() => {
    if (editingTutorial) {
      setValue('title', editingTutorial.title);
      setValue(
        'url',
        editingTutorial.url ||
          `https://youtube.com/watch?v=${editingTutorial.videoId}`
      );
      setValue('category', editingTutorial.category);
    } else {
      reset({
        title: '',
        url: '',
        category: CATEGORIES[0],
      });
    }
  }, [editingTutorial, setValue, reset]);

  const onSubmit = async (data: ITutorialFormValues) => {
    setIsSubmitting(true);
    try {
      const isEditing = !!editingTutorial;
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/tutorials/${editingTutorial._id}`
        : `${process.env.NEXT_PUBLIC_API_URL}/tutorials`;

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok)
        throw new Error(
          `Failed to ${isEditing ? 'update' : 'create'} tutorial`
        );

      toast.success(
        `Tutorial ${isEditing ? 'updated' : 'published'} successfully!`
      );

      reset();
      onSuccess?.();
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-card border border-border rounded-xl p-6 transition-all duration-300'>
      <div className='flex items-center justify-between mb-6'>
        <h3 className='text-xl font-bold text-foreground flex items-center gap-2'>
          <div
            className={`rounded-full p-1 text-white ${
              editingTutorial ? 'bg-blue-500' : 'bg-green-500'
            }`}>
            {editingTutorial ? <EditIcon size={14} /> : <Upload size={14} />}
          </div>
          {editingTutorial ? 'Edit Tutorial' : 'Add New Tutorial'}
        </h3>
        {editingTutorial && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onCancel}
            className='h-8 w-8 p-0 rounded-full hover:bg-muted'>
            <X size={16} />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='space-y-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Tutorial Title
          </label>
          <input
            {...register('title')}
            className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring'
            placeholder='e.g. How to use the Reading Tracker'
          />
          {errors.title && (
            <span className='text-red-500 text-xs'>{errors.title.message}</span>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            YouTube URL
          </label>
          <input
            {...register('url')}
            className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring'
            placeholder='https://youtube.com/watch?v=...'
          />
          {errors.url && (
            <span className='text-red-500 text-xs'>{errors.url.message}</span>
          )}
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Assign Category
          </label>
          <select
            {...register('category')}
            className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring appearance-none'>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className='flex gap-2 pt-2'>
          {editingTutorial && (
            <Button
              type='button'
              variant='secondary'
              onClick={onCancel}
              className='flex-1'>
              Cancel
            </Button>
          )}
          <Button
            type='submit'
            disabled={isSubmitting}
            className={`flex-1 text-white font-medium py-2 rounded-lg ${
              editingTutorial
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-green-500 hover:bg-green-600'
            }`}>
            {isSubmitting
              ? 'Saving...'
              : editingTutorial
              ? 'Update Tutorial'
              : 'Publish Tutorial'}
          </Button>
        </div>
      </form>
    </div>
  );
}

function EditIcon({ size }: { size: number }) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z'></path>
    </svg>
  );
}
