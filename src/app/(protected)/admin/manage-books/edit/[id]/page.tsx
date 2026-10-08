import { booksApi, EditBookFormWrapper, type IBook, type IGenre } from '@src/features/books/books.index';
import { genresApi } from '@src/features/genres/genres.index';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

interface IEditBookPageProps {
  params: Promise<{ id: string }>;
}

async function getBook(id: string): Promise<IBook | undefined> {
  try {
    const res = await booksApi.getBookById(id);
    if ('book' in res) return res.book;
    return res as IBook;
  } catch {
    return undefined;
  }
}

async function getGenres(): Promise<IGenre[]> {
  try {
    const data = await genresApi.getGenres(100);
    return data.genres || [];
  } catch (error) {
    console.error('Failed to fetch genres:', error);
    return [];
  }
}

async function EditBookContent({ params }: IEditBookPageProps) {
  const { id } = await params;
  const [book, genres] = await Promise.all([getBook(id), getGenres()]);

  if (!book) {
    notFound();
  }

  return (
    <>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8'>
        <div className='space-y-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Link
              href='/admin/manage-books'
              className='hover:text-foreground transition-colors'>
              Manage Books
            </Link>
            <span className='text-muted-foreground/40'>›</span>
            <span className='text-foreground font-medium'>Edit Book</span>
          </div>
          <div>
            <h1 className='text-3xl font-serif font-bold text-foreground'>
              Edit Book Details
            </h1>
            <p className='text-muted-foreground mt-1'>
              Update information for{' '}
              <span className='italic'>&quot;{book.title}&quot;</span>
            </p>
          </div>
        </div>
      </div>

      <div className='bg-card border border-border rounded-xl p-6 shadow-sm'>
        <EditBookFormWrapper book={book} genres={genres} />
      </div>
    </>
  );
}

export default function EditBookPage({ params }: IEditBookPageProps) {
  return (
    <div className='p-8 max-w-2xl mx-auto'>
      <Suspense
        fallback={
          <div className='flex justify-center py-16'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <EditBookContent params={params} />
      </Suspense>
    </div>
  );
}
