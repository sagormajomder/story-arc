'use client';

import { ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '../ui/button';
import DeleteBookModal from './DeleteBookModal';

export default function BookTable({ books, currentPage, totalPages }) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handlePageChange = newPage => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`?${params.toString()}`);
  };

  const handleDeleteClick = book => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${selectedBook._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete book');

      toast.success('Book deleted successfully');
      router.refresh(); // Refresh Server Component data
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete book');
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setSelectedBook(null);
    }
  };

  return (
    <>
      <div className='border border-border rounded-xl overflow-hidden bg-card shadow-sm w-full  md:max-w-full'>
        <div className='overflow-x-auto w-full'>
          <table className='w-full text-left text-sm whitespace-nowrap'>
            <thead>
              <tr className='bg-muted/50 border-b border-border text-muted-foreground uppercase text-xs tracking-wider'>
                <th className='px-6 py-4 font-medium'>Cover</th>
                <th className='px-6 py-4 font-medium'>Title</th>
                <th className='px-6 py-4 font-medium'>Author</th>
                <th className='px-6 py-4 font-medium'>Genre</th>
                <th className='px-6 py-4 font-medium text-right'>Actions</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-border'>
              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan='5'
                    className='px-6 py-8 text-center text-muted-foreground'>
                    No books found.
                  </td>
                </tr>
              ) : (
                books.map(book => (
                  <tr
                    key={book._id}
                    className='group hover:bg-muted/30 transition-colors'>
                    <td className='px-6 py-4'>
                      <div className='relative h-16 w-12 rounded shadow-sm overflow-hidden bg-muted'>
                        <Image
                          src={
                            book.cover ||
                            'https://placehold.co/400x600?text=No+Cover'
                          }
                          alt={book.title}
                          fill
                          sizes='(min-width: 1280px) 600px, (min-width: 768px) 400px, 200px'
                          className='object-cover'
                        />
                      </div>
                    </td>
                    <td className='px-6 py-4 font-medium text-foreground'>
                      {book.title}
                    </td>
                    <td className='px-6 py-4 text-muted-foreground'>
                      {book.author}
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground`}>
                        {book.genre}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-right'>
                      <div className='flex items-center justify-end gap-2'>
                        <Link href={`/admin/manage-books/edit/${book._id}`}>
                          <button className='p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors'>
                            <Edit size={16} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(book)}
                          className='p-2 text-destructive/80 hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors'>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {books.length > 0 && (
          <div className='flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20'>
            <span className='text-sm text-muted-foreground'>
              Page {currentPage} of {totalPages}
            </span>
            <div className='flex items-center gap-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className='h-8 w-8 p-0'>
                <ChevronLeft className='h-4 w-4' />
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className='h-8 w-8 p-0'>
                <ChevronRight className='h-4 w-4' />
              </Button>
            </div>
          </div>
        )}
      </div>

      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        onClose={setIsDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        bookTitle={selectedBook?.title}
        isDeleting={isDeleting}
      />
    </>
  );
}
