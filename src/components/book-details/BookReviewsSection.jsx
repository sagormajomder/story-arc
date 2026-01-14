'use client';
import { useState } from 'react';
import ReviewList from './ReviewList';
import WriteReview from './WriteReview';

const BookReviewsSection = ({ bookId }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewAdded = () => {
    setRefreshKey(prev => prev + 1);
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
