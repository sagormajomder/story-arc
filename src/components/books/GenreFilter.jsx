'use client';

import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GenreFilter({ genres }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = searchParams.get('genre') || 'All Genres';

  const handleGenreClick = genre => {
    const params = new URLSearchParams(searchParams);
    if (genre === 'All Genres') {
      params.delete('genre');
    } else {
      params.set('genre', genre);
    }
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className='flex flex-wrap items-center gap-3'>
      {genres.map(genre => (
        <Button
          key={genre}
          onClick={() => handleGenreClick(genre)}
          variant={selectedGenre === genre ? 'default' : 'secondary'}
          className={`rounded-full ${
            selectedGenre === genre
              ? 'bg-green-500 hover:bg-green-600 text-white'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}>
          {genre}
          {selectedGenre !== genre && (
            <ChevronDown size={14} className='ml-1 opacity-70' />
          )}
        </Button>
      ))}
    </div>
  );
}
