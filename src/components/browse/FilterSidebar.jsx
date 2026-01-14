'use client';

import { Star } from 'lucide-react';

export default function FilterSidebar({
  genres = [],
  selectedGenres = [],
  setSelectedGenres,
  ratingRange,
  setRatingRange,
}) {
  const toggleGenre = genre => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className='w-full md:w-64 flex-shrink-0 space-y-8'>
      {/* Genres */}
      <div>
        <h3 className='font-serif font-bold text-lg mb-4 text-foreground'>
          Genres
        </h3>
        <p className='text-xs text-muted-foreground mb-3'>
          Select multiple categories
        </p>
        <div className='space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar'>
          {genres?.map(genre => (
            <button
              key={genre}
              onClick={() => toggleGenre(genre)}
              className={`w-full text-left px-4 py-2 rounded-md text-sm transition-all flex items-center gap-2 ${
                selectedGenres.includes(genre)
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'
              }`}>
              {selectedGenres.includes(genre) && (
                <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse' />
              )}
              {genre}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Range */}
      <div>
        <h3 className='font-serif font-bold text-lg mb-4 text-foreground'>
          Rating Range
        </h3>
        <div className='space-y-4 p-4 bg-secondary/20 rounded-lg border border-border/50'>
          <div className='flex items-center justify-between gap-4'>
            <div className='space-y-1'>
              <label className='text-xs text-muted-foreground'>Min Stars</label>
              <div className='flex items-center gap-2 bg-background p-2 rounded border border-input'>
                <Star className='w-3 h-3 text-green-500 fill-current' />
                <input
                  type='number'
                  min='0'
                  max='5'
                  step='0.1'
                  value={ratingRange[0]}
                  onChange={e =>
                    setRatingRange([e.target.value, ratingRange[1]])
                  }
                  className='w-full bg-transparent outline-none text-sm font-bold w-12'
                />
              </div>
            </div>
            <div className='h-[2px] w-4 bg-muted-foreground/30 mt-5' />
            <div className='space-y-1'>
              <label className='text-xs text-muted-foreground'>Max Stars</label>
              <div className='flex items-center gap-2 bg-background p-2 rounded border border-input'>
                <Star className='w-3 h-3 text-green-500 fill-current' />
                <input
                  type='number'
                  min='0'
                  max='5'
                  step='0.1'
                  value={ratingRange[1]}
                  onChange={e =>
                    setRatingRange([ratingRange[0], e.target.value])
                  }
                  className='w-full bg-transparent outline-none text-sm font-bold w-12'
                />
              </div>
            </div>
          </div>
          <div className='relative h-2 bg-muted rounded-full overflow-hidden'>
            <div
              className='absolute top-0 h-full bg-green-500 opacity-50'
              style={{
                left: `${(ratingRange[0] / 5) * 100}%`,
                right: `${100 - (ratingRange[1] / 5) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
