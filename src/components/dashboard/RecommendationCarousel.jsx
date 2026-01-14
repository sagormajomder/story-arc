'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';

export default function RecommendationCarousel({ books }) {
  const scrollRef = useRef(null);

  const scroll = direction => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === 'left' ? -300 : 300;
      current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!books || books.length === 0) {
    return (
      <div className='text-muted-foreground'>
        No recommendations available yet.
      </div>
    );
  }

  return (
    <div className='relative group'>
      <div className='flex justify-between items-center mb-6'>
        <div>
          <h2 className='text-2xl font-bold font-serif text-foreground'>
            Recommended for You
          </h2>
          <p className='text-sm text-muted-foreground'>
            Based on your interest in various genres
          </p>
        </div>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            onClick={() => scroll('left')}
            className='rounded-full bg-card border-border hover:bg-secondary'>
            <ChevronLeft size={20} />
          </Button>
          <Button
            variant='outline'
            size='icon'
            onClick={() => scroll('right')}
            className='rounded-full bg-card border-border hover:bg-secondary'>
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className='flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {books.map(book => (
          <div
            key={book._id}
            className='snap-start shrink-0 w-[200px] flex flex-col gap-3 group/card'>
            <Link
              href={`/user/books/${book._id}`}
              className='block relative aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md'>
              <Image
                src={book.cover}
                alt={book.title}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover group-hover/card:scale-105 transition-transform duration-500'
              />
            </Link>
            <div>
              <Link
                href={`/user/books/${book._id}`}
                className='font-bold text-foreground hover:text-green-500 transition-colors line-clamp-1'>
                {book.title}
              </Link>
              <p className='text-xs text-muted-foreground line-clamp-1'>
                {book.author}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
