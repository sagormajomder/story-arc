import BrowseBooksClient from '@/components/browse/BrowseBooksClient';
import Container from '@/components/layouts/Container';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

async function getGenres() {
  const session = await getServerSession(authOptions);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/genres?limit=1000`,
      {
        next: { revalidate: 3600 },
        headers: {
          Authorization: session?.token ? `Bearer ${session.token}` : '',
        },
      }
    );

    if (!res.ok) {
      console.error('Fetch genres failed with status:', res.status);
      return [];
    }

    // The API returns { genres: [{name: 'Sci-Fi', ...}, ...], ... }
    const data = await res.json();

    if (data.genres && Array.isArray(data.genres)) {
      return data.genres.map(g => g.name);
    }

    // Fallback if data is just the array (backwards compat if API changes back)
    if (Array.isArray(data)) return data;

    return [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

export const metadata = {
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
