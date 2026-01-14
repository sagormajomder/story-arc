'use client';

import { Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function BookCard({ book }) {
  return (
    <Link href={`/user/books/${book._id}`} className='group block'>
      <div className='relative aspect-[2/3] overflow-hidden rounded-lg shadow-md mb-3'>
        <Image
          src={book.cover}
          alt={book.title}
          fill
          sizes='(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw'
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
        {/* Overlay gradient for text readability if needed, but design shows text below */}
      </div>

      <div className='space-y-1'>
        <div className='flex items-start justify-between gap-2'>
          <h3 className='font-serif font-bold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors'>
            {book.title}
          </h3>
          <div className='flex items-center gap-1 text-green-500 shrink-0'>
            <span className='text-sm font-bold'>{book.rating || 'N/A'}</span>
            <Star className='w-3 h-3 fill-current' />
          </div>
        </div>

        <p className='text-sm text-muted-foreground truncate'>{book.author}</p>
      </div>
    </Link>
  );
}
