import { Container } from '@src/components/layouts/Container';
import { BrowseBooksClient } from '@src/features/books/books.index';
import { genresApi, type IGenre } from '@src/features/genres/genres.index';
import { Loader2 } from 'lucide-react';
import { Metadata } from 'next';
import { Suspense } from 'react';

async function getGenres(): Promise<string[]> {
  try {
    const data = await genresApi.getGenres(1000);

    if (data.genres && Array.isArray(data.genres)) {
      return data.genres.map((g: IGenre) => g.name);
    }

    if (Array.isArray(data)) return (data as unknown as IGenre[]).map((g: IGenre) => g.name);

    return [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'Browse Books | Story Arc',
  description: 'Explore our vast collection of books across various genres.',
};

async function BooksContent() {
  const genres = await getGenres();
  return <BrowseBooksClient initialGenres={genres} />;
}

export default function BrowseBooksPage() {
  return (
    <div className='py-8'>
      <Container>
        <div className='mb-8'>
          <h1 className='text-3xl font-serif font-bold text-foreground'>
            Browse Books
          </h1>
          <p className='text-muted-foreground mt-2'>
            Discover your next favorite read from our curated collection.
          </p>
        </div>
        <Suspense
          fallback={
            <div className='flex justify-center py-16'>
              <Loader2 className='w-8 h-8 animate-spin text-primary' />
            </div>
          }>
          <BooksContent />
        </Suspense>
      </Container>
    </div>
  );
}
