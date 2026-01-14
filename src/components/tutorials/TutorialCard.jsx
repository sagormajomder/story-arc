'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function TutorialCard({ tutorial }) {
  return (
    <div className='group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300'>
      <div className='relative aspect-video bg-black'>
        <Image
          src={tutorial.thumbnail}
          alt={tutorial.title}
          fill
          className='object-cover opacity-90 group-hover:opacity-100 transition-opacity'
        />
        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-300 shadow-xl'>
            <Play size={20} fill='currentColor' />
          </div>
        </div>
      </div>

      <div className='p-5'>
        <span className='bg-green-500/10 text-green-500 text-xs font-bold px-2 py-1 rounded mb-3 inline-block uppercase tracking-wider'>
          {tutorial.category}
        </span>
        <h3 className='font-bold text-lg text-foreground mb-2 line-clamp-2 leading-tight'>
          {tutorial.title}
        </h3>
        <p className='text-muted-foreground text-sm line-clamp-2 mb-4'>
          Master your reading journey with our curated guides.
        </p>

        <Link
          href={tutorial.url}
          target='_blank'
          className='text-green-500 text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all'>
          Watch Now <span className='text-lg'>→</span>
        </Link>
      </div>
    </div>
  );
}

export function TutorialSkeleton() {
  return (
    <div className='bg-card border border-border rounded-xl overflow-hidden animate-pulse'>
      <div className='aspect-video bg-secondary'></div>
      <div className='p-5 space-y-3'>
        <div className='w-20 h-5 bg-secondary rounded'></div>
        <div className='w-full h-6 bg-secondary rounded'></div>
        <div className='w-2/3 h-6 bg-secondary rounded'></div>
        <div className='w-full h-4 bg-secondary rounded mt-2'></div>
        <div className='w-24 h-5 bg-secondary rounded mt-4'></div>
      </div>
    </div>
  );
}
