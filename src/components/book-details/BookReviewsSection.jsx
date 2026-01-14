'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import ReviewList from './ReviewList';
import WriteReview from './WriteReview';

const BookReviewsSection = ({ bookId }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const router = useRouter();

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
    router.refresh();
  };

  return (
    <div className='grid md:grid-cols-2 gap-16'>
      <div className='md:col-span-1'>
        <WriteReview bookId={bookId} onReviewAdded={handleReviewAdded} />
      </div>
      <div className='md:col-span-1'>
        <ReviewList key={refreshKey} bookId={bookId} />
      </div>
    </div>
  );
};

export default BookReviewsSection;
