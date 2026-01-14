import Link from 'next/link';
import { notFound } from 'next/navigation';
import EditBookClientWrapper from '../../../../../../components/pages/adminPages/editBookPage/EditBookClientWrapper';

async function getBook(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${id}`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return undefined;
  }

  return res.json();
}

export default async function EditBookPage({ params }) {
  const { id } = await params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  return (
    <div className='p-8 max-w-2xl mx-auto'>
      {/* Header with Breadcrumb */}
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
        <EditBookClientWrapper book={book} />
      </div>
    </div>
  );
}
