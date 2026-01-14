import AddGenreForm from '@/components/genres/AddGenreForm';
import GenreList from '@/components/genres/GenreList';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

async function getGenres() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/genres?limit=100`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    return { genres: [], totalGenres: 0 };
  }

  return res.json();
}

export default async function ManageGenresPage() {
  const data = await getGenres();
  const genres = data.genres || [];
  const totalGenres = data.totalGenres || 0;

  return (
    <div className='p-8 max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-foreground'>
            Manage Genres
          </h1>
          <p className='text-muted-foreground mt-1'>
            Add, update, or remove book categories available to users
          </p>
        </div>
      </div>

      {/* Add Form */}
      <AddGenreForm />

      {/* List Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-xl font-bold text-foreground'>Existing Genres</h2>
        <span className='bg-green-500/10 text-green-500 px-2 py-1 rounded text-xs font-bold uppercase tracking-wide'>
          {totalGenres} Total
        </span>
      </div>

      {/* Genre Grid */}
      <GenreList genres={genres} />
    </div>
  );
}
