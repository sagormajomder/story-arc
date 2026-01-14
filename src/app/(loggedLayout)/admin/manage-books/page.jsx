import BookTable from '@/components/books/BookTable';
import GenreFilter from '@/components/books/GenreFilter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';

async function getBooks(genre, page = 1) {
  const params = new URLSearchParams();
  if (genre) params.append('genre', genre);
  params.append('page', page);
  params.append('limit', 5);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/books?${params.toString()}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch books');
  }

  return res.json();
}

async function getGenres() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/genres`, {
    cache: 'no-store', // Genres might change when books are added
  });

  if (!res.ok) {
    // Graceful fallback for genres if fails (or return empty array)
    return [];
  }

  return res.json();
}

export default async function ManageBooksPage({ searchParams }) {
  const { genre, page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const [booksData, availableGenres] = await Promise.all([
    getBooks(genre, currentPage),
    getGenres(),
  ]);

  const { books, totalPages } = booksData;
  const genres = ['All Genres', ...availableGenres];

  return (
    <div className='p-8 max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-serif font-bold text-foreground'>
            Manage Books
          </h1>
          <p className='text-muted-foreground mt-1'>
            Oversee and update your application&apos;s book library.
          </p>
        </div>
        <Link href='/admin/manage-books/add'>
          <Button className='bg-green-500 hover:bg-green-600 text-white gap-2 font-medium'>
            <Plus size={18} /> Add New Book
          </Button>
        </Link>
      </div>

      {/* Controls */}
      <GenreFilter genres={genres} />

      {/* Table */}
      <BookTable
        books={books}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
