'use client';

import { Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DeleteBookModal from './DeleteBookModal';

export default function BookTable({ books }) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = book => {
    setSelectedBook(book);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBook) return;
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${selectedBook._id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

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
      <div className='border border-border rounded-xl overflow-hidden bg-card shadow-sm'>
        <div className='overflow-x-auto'>
          <table className='w-full text-left text-sm'>
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
              Showing 1 to {books.length} of {books.length} entries
            </span>
            {/* Pagination placeholder */}
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
