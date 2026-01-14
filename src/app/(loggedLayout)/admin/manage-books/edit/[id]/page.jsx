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

  // Server Action or Client Handler Wrapper?
  // Since BookForm is client-side hook-form, we'll keep the submit logic client-side for now via the form wrapper,
  // OR we can make a small client wrapper for the edit logic.
  // The prompt asked for "priority to using server components", but forms are inherently interactive.
  // The page itself fetches data on server.
  // We can't pass server actions easily without enabling them, so we'll simulate the client-side submit being passed or handled by a wrapper.
  // Actually, BookForm takes `onSubmit` prop.
  // We need a client component wrapper to handle the submission logic (router.push etc) OR adapt BookForm.
  // Let's create a specific Client Component for the Edit Form logic if needed,
  // BUT the existing BookForm is reusable.
  // Let's create `EditBookFormWrapper.jsx` to handle the logic that was previously in the page.

  return (
    <div className='p-8 max-w-7xl mx-auto'>
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

      <EditBookClientWrapper book={book} />
    </div>
  );
}
