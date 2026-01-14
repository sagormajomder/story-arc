import { useSession } from 'next-auth/react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const WriteReview = ({ bookId, onReviewAdded }) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!session?.user) {
      return toast.error('Please login to write a review');
    }
    if (rating === 0) {
      return toast.error('Please select a rating');
    }

    setLoading(true);
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
          rating,
          comment,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to submit review');
      }

      toast.success('Review submitted successfully');
      setRating(0);
      setComment('');
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      console.error(error);
      const msg = error.message || 'Failed to submit review';
      toast.error(msg);
    } finally {
      setLoading(false);
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

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='flex gap-2 mb-4'>
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type='button'
              className='focus:outline-none transition-transform hover:scale-110'
              onClick={() => setRating(star)}
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

        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder='Write your review here...'
          className='w-full bg-input/50 border border-input rounded p-4 text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px]'
          required></textarea>

        <button
          type='submit'
          disabled={loading}
          className='w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold font-serif rounded transition-colors disabled:opacity-70 disabled:cursor-not-allowed'>
          {loading ? 'Submitting...' : 'Write a Review'}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;
