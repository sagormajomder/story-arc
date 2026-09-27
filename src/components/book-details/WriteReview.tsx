'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { FC, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating (1-5 stars)').max(5),
  comment: z.string().min(1, 'Please write your review comment'),
});

export type IReviewSchemaType = z.infer<typeof reviewSchema>;

export interface IWriteReviewProps {
  bookId: string;
  onReviewAdded?: () => void;
}

const WriteReview: FC<IWriteReviewProps> = ({ bookId, onReviewAdded }) => {
  const { data: session } = useSession();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<IReviewSchemaType>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
    },
  });

  const rating = watch('rating');

  const onSubmit = async (values: IReviewSchemaType) => {
    if (!session?.user) {
      toast.error('Please login to write a review');
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({
          bookId,
          userEmail: session.user.email,
          userName: session.user.name,
          userImage: session.user.image,
          rating: values.rating,
          comment: values.comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success(
        'Review submitted successfully. Please wait for admin approval'
      );
      reset({ rating: 0, comment: '' });
      if (onReviewAdded) onReviewAdded();
    } catch (error: unknown) {
      console.error(error);
      const msg =
        error instanceof Error ? error.message : 'Failed to submit review';
      toast.error(msg);
    }
  };

  return (
    <div className='bg-card p-8 rounded-lg border border-border mb-12 shadow-sm'>
      <h3 className='text-2xl font-serif font-bold text-foreground mb-2'>
        Rate this book
      </h3>
      <p className='text-muted-foreground mb-6 text-sm'>
        Share your thoughts with the community.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div>
          <div className='flex gap-2 mb-2'>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                type='button'
                className='focus:outline-none transition-transform hover:scale-110'
                onClick={() => setValue('rating', star, { shouldValidate: true })}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}>
                <svg
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating)
                      ? 'text-primary fill-current'
                      : 'text-muted fill-current'
                  }`}
                  viewBox='0 0 24 24'>
                  <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                </svg>
              </button>
            ))}
          </div>
          {errors.rating && (
            <p className='text-destructive text-sm'>{errors.rating.message}</p>
          )}
        </div>

        <div>
          <textarea
            {...register('comment')}
            placeholder='Write your review here...'
            className='w-full bg-input/50 border border-input rounded p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]'
          />
          {errors.comment && (
            <p className='text-destructive text-sm mt-1'>
              {errors.comment.message}
            </p>
          )}
        </div>

        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-serif rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
          {isSubmitting ? 'Submitting...' : 'Write a Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
