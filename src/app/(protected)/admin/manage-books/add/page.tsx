import { AddBookFormWrapper, type IGenre } from '@src/features/books/books.index';
import { genresApi } from '@src/features/genres/genres.index';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';

async function getGenres(): Promise<IGenre[]> {
  try {
    const data = await genresApi.getGenres(100);
    return data.genres || [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

async function AddBookContent() {
  const genres = await getGenres();
  return (
    <div className='bg-card border border-border rounded-xl p-6 shadow-sm'>
      <AddBookFormWrapper genres={genres} />
    </div>
  );
}

export default function AddBookPage() {
  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <Link
        href='/admin/manage-books'
        className='inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors'>
        <ChevronLeft size={16} className='mr-1' />
        Back to Library
      </Link>

      <div className='mb-8'>
        <h1 className='text-3xl font-serif font-bold text-foreground'>
          Add New Book
        </h1>
        <p className='text-muted-foreground mt-1'>
          Enter the details below to add a new title to the catalog.
        </p>
      </div>

      <Suspense
        fallback={
          <div className='flex justify-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <AddBookContent />
      </Suspense>
    </div>
  );
}
