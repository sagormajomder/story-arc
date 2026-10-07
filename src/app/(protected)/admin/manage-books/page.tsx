import { Button } from '@src/components/ui/button';
import { booksApi, BookTable, GenreFilter, IBook } from '@src/features/books/books.index';
import { IPaginatedResponse } from '@src/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';

interface IManageBooksSearchParams {
  genre?: string;
  page?: string;
}

interface IManageBooksPageProps {
  searchParams: Promise<IManageBooksSearchParams>;
}

async function getBooks(
  genre?: string,
  page: number = 1
): Promise<IPaginatedResponse<IBook>> {
  return (await booksApi.getBooks({
    genre: genre ? [genre] : undefined,
    page,
    limit: 5,
  })) as unknown as IPaginatedResponse<IBook>;
}

async function getGenres(): Promise<string[]> {
  try {
    const data = await booksApi.getGenres();
    return data.genres || [];
  } catch {
    return [];
  }
}

export default async function ManageBooksPage({
  searchParams,
}: IManageBooksPageProps) {
  const { genre, page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
  const [booksData, availableGenres] = await Promise.all([
    getBooks(genre, currentPage),
    getGenres(),
  ]);

  const { books = [], totalPages = 1 } = booksData;
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
