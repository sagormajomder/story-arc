'use client';

import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from 'next/image';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const genres = [
  'Fiction',
  'Non-Fiction',
  'Sci-Fi',
  'Fantasy',
  'Mystery',
  'Biography',
  'History',
  'Self-Help',
];

export default function BookForm({ initialData, onSubmit, isSubmitting }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: initialData || {
      title: '',
      author: '',
      genre: '',
      description: '',
      cover: '',
    },
  });

  const [preview, setPreview] = useState(initialData?.cover || '');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
      {/* Cover Image Upload */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-muted-foreground'>
          Cover Image
        </label>
        <CldUploadWidget
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          onSuccess={result => {
            const url = result?.info?.secure_url;
            if (url) {
              setPreview(url);
              setValue('cover', url);
            }
          }}>
          {({ open }) => (
            <div
              onClick={() => open()}
              className='relative w-full h-64 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors group cursor-pointer overflow-hidden'>
              {preview ? (
                <Image
                  src={preview}
                  alt='Cover preview'
                  fill
                  sizes='(min-width: 1280px) 600px, (min-width: 768px) 400px, 200px'
                  className='object-contain p-2'
                />
              ) : (
                <div className='flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors'>
                  <div className='p-3 rounded-full bg-secondary text-secondary-foreground'>
                    <Upload size={24} />
                  </div>
                  <div className='text-center'>
                    <p className='font-medium'>Click to upload cover</p>
                    <p className='text-xs text-muted-foreground'>
                      PNG, JPG up to 10MB (Recommended: 600x900px)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </CldUploadWidget>
      </div>

      <div className='grid md:grid-cols-2 gap-6'>
        {/* Book Title */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Book Title
          </label>
          <input
            {...register('title', { required: 'Title is required' })}
            className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all'
            placeholder='e.g. The Midnight Library'
          />
          {errors.title && (
            <span className='text-red-500 text-xs'>{errors.title.message}</span>
          )}
        </div>

        {/* Author Name */}
        <div className='space-y-2'>
          <label className='text-sm font-medium text-muted-foreground'>
            Author Name
          </label>
          <input
            {...register('author', { required: 'Author is required' })}
            className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all'
            placeholder='e.g. Matt Haig'
          />
          {errors.author && (
            <span className='text-red-500 text-xs'>
              {errors.author.message}
            </span>
          )}
        </div>
      </div>

      {/* Genre */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-muted-foreground'>
          Genre
        </label>
        <select
          {...register('genre', { required: 'Genre is required' })}
          className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none'>
          <option value=''>Select a genre</option>
          {genres.map(g => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        {errors.genre && (
          <span className='text-red-500 text-xs'>{errors.genre.message}</span>
        )}
      </div>

      {/* Description */}
      <div className='space-y-2'>
        <label className='text-sm font-medium text-muted-foreground'>
          Description
        </label>
        <textarea
          {...register('description', { required: 'Description is required' })}
          className='w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border focus:outline-none focus:ring-2 focus:ring-ring transition-all min-h-[120px] resize-y'
          placeholder='Write a brief summary of the book...'
        />
        {errors.description && (
          <span className='text-red-500 text-xs'>
            {errors.description.message}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-3 pt-4 border-t border-border'>
        <Button
          type='button'
          variant='ghost'
          onClick={() => window.history.back()}
          className='text-muted-foreground hover:text-foreground'>
          Cancel
        </Button>
        <Button
          type='submit'
          disabled={isSubmitting}
          className='bg-green-500 hover:bg-green-600 text-white min-w-[140px]'>
          {isSubmitting
            ? 'Saving...'
            : initialData
            ? 'Update Information'
            : 'Create Book'}
        </Button>
      </div>
    </form>
  );
}
