import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import AddBookClientWrapper from '../../../../../components/pages/adminPages/addBookPage/AddBookClientWrapper';

async function getGenres() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/genres?limit=100`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.genres || [];
}

export default async function AddBookPage() {
  const genres = await getGenres();

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

      <div className='bg-card border border-border rounded-xl p-6 shadow-sm'>
        <AddBookClientWrapper genres={genres} />
      </div>
    </div>
  );
}
