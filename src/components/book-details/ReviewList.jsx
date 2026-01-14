'use client';
import { formatDistanceToNow } from 'date-fns';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const ReviewList = ({ bookId }) => {
  const [reviews, setReviews] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${bookId}`
      );
      if (!res.ok) throw new Error('Failed to fetch reviews');
      const data = await res.json();
      setReviews(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch reviews', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) {
      fetchReviews();
    }
  }, [bookId]);

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  if (loading) return <div>Loading reviews...</div>;

  if (reviews.length === 0)
    return (
      <div className='text-gray-500 italic'>
        No reviews yet. Be the first to review!
      </div>
    );

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-serif font-bold text-white'>
          Community Reviews
        </h2>
        <div className='text-sm text-gray-400'>
          Sort by:{' '}
          <span className='text-white font-bold cursor-pointer'>
            Most Recent
          </span>
        </div>
      </div>

      <div className='grid gap-4'>
        {displayedReviews.map(review => (
          <div
            key={review._id}
            className='bg-gray-900/50 p-6 rounded-lg border border-gray-800'>
            <div className='flex justify-between items-start mb-4'>
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full overflow-hidden relative border border-gray-700'>
                  <Image
                    src={review.userImage || '/placeholder-user.jpg'}
                    alt={review.userName}
                    fill
                    sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                    className='object-cover'
                  />
                </div>
                <div>
                  <h4 className='text-white font-bold text-sm'>
                    {review.userName}
                  </h4>
                  <p className='text-xs text-gray-500 uppercase'>
                    {review.role || 'Reader'} -{' '}
                    {formatDistanceToNow(new Date(review.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>
              <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-green-500 fill-current'
                        : 'text-gray-700 fill-current'
                    }`}
                    viewBox='0 0 24 24'>
                    <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                  </svg>
                ))}
              </div>
            </div>
            <p className='text-gray-300 italic font-serif leading-relaxed'>
              "{review.comment}"
            </p>
            <div className='mt-4 flex gap-4 text-xs text-gray-500 font-bold uppercase tracking-wider'>
              <button className='flex items-center gap-1 hover:text-white transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5'
                  />
                </svg>
                Helpful ({Math.floor(Math.random() * 50)})
              </button>
              <button className='flex items-center gap-1 hover:text-white transition-colors'>
                <svg
                  className='w-4 h-4'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                  />
                </svg>
                Reply
              </button>
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 3 && (
        <div className='text-center pt-4'>
          <button
            onClick={() => setShowAll(!showAll)}
            className='text-green-500 font-bold hover:text-green-400 transition-colors uppercase tracking-widest text-sm'>
            {showAll ? 'Show Less' : `View all ${reviews.length} reviews`}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
