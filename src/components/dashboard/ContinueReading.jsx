'use client';

import { Button } from '@/components/ui/button';
import { Bookmark, Play, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function ContinueReading({ currentBook }) {
  if (!currentBook) {
    return (
      <div className='bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center h-[300px]'>
        <p className='text-muted-foreground mb-4'>
          You don't have any books in progress.
        </p>
        <Link href='/user/books'>
          <Button>Find a Book</Button>
        </Link>
      </div>
    );
  }

  const { book, progress, totalPages } = currentBook;
  const percentage = Math.round((progress / (totalPages || 1)) * 100);

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold font-serif text-foreground'>
          Continue Reading
        </h2>
        <Link
          href='/user/library'
          className='text-sm text-green-500 font-bold hover:underline'>
          View All Active
        </Link>
      </div>

      <div className='bg-card border border-border rounded-xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-colors'>
        <div className='flex flex-col md:flex-row gap-6 relative z-10'>
          {/* Book Cover */}
          <div className='shrink-0 w-32 md:w-40 aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg'>
            <Image
              src={book.cover}
              alt={book.title}
              fill
              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
              className='object-cover'
            />
          </div>

          {/* Content */}
          <div className='flex-1 flex flex-col justify-between py-2'>
            <div>
              <div className='flex justify-between items-start mb-1'>
                <span className='text-[10px] font-bold tracking-widest text-green-500 uppercase'>
                  Currently Reading
                </span>
                <span className='text-xs text-muted-foreground'>
                  Last read 2h ago
                </span>{' '}
                {/* Mock */}
              </div>

              <h3 className='text-2xl md:text-3xl font-bold text-foreground font-serif mb-1 line-clamp-1'>
                {book.title}
              </h3>
              <p className='text-muted-foreground mb-6'>{book.author}</p>

              <div className='mb-2 flex justify-between text-sm font-bold'>
                <span className='text-foreground'>Progress</span>
                <span className='text-green-500'>{percentage}%</span>
              </div>
              <div className='h-3 bg-secondary/30 rounded-full overflow-hidden mb-2'>
                <div
                  className='h-full bg-green-500 rounded-full'
                  style={{ width: `${percentage}%` }}></div>
              </div>
              <p className='text-xs text-muted-foreground flex items-center gap-2'>
                <span className='w-2 h-2 bg-green-500 rounded-full inline-block'></span>
                Chapter 12 of 18 • 45 mins left {/* Mock */}
              </p>
            </div>

            {/* Actions */}
            <div className='flex gap-3 mt-6'>
              <Link href={`/user/library`} className='flex-1'>
                <Button className='w-full bg-green-500 hover:bg-green-400 text-green-950 font-bold h-12'>
                  <Play size={18} className='mr-2 fill-current' />
                  Resume Reading
                </Button>
              </Link>
              <Button
                variant='outline'
                size='icon'
                className='h-12 w-12 border-border bg-secondary/20'>
                <Bookmark size={18} />
              </Button>
              <Button
                variant='outline'
                size='icon'
                className='h-12 w-12 border-border bg-secondary/20'>
                <Share2 size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
