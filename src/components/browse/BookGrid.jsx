'use client';

import BookCard from './BookCard';

export default function BookGrid({ books, loading }) {
  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='aspect-[2/3] bg-muted rounded-lg'></div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className='text-center py-20'>
        <h3 className='text-xl font-serif font-bold text-muted-foreground'>
          No books found.
        </h3>
        <p className='text-sm text-muted-foreground'>
          Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {books.map(book => (
        <BookCard key={book._id} book={book} />
      ))}
    </div>
  );
}
