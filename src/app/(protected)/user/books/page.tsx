import { authOptions } from '@src/app/api/auth/[...nextauth]/route';
import Container from '@src/components/layouts/Container';
import { BrowseBooksClient } from '@src/features/books/books.index';
import { genresApi } from '@src/features/genres/genres.index';
import { IGenre } from '@src/types';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';

async function getGenres(): Promise<string[]> {
  const session = await getServerSession(authOptions);
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

export default async function BrowseBooksPage() {
  const genres = await getGenres();

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
        <BrowseBooksClient initialGenres={genres} />
      </Container>
    </div>
  );
}
