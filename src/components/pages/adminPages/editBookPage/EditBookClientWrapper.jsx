'use client';

import BookForm from '@/components/books/BookForm';
import DeleteBookModal from '@/components/books/DeleteBookModal';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function EditBookClientWrapper({ book }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async data => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update book');
      }

      toast.success('Book updated successfully!');
      router.push('/admin/manage-books');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      toast.success('Book deleted successfully');
      router.push('/admin/manage-books');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete book');
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <div className='grid lg:grid-cols-3 gap-8'>
        {/* Main Form Area */}
        <div className='lg:col-span-2 bg-card border border-border rounded-xl p-6 shadow-sm h-fit'>
          <BookForm
            initialData={book}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </div>

        {/* Sidebar / Cover Preview (Optional layout from design) */}
        <div className='lg:col-span-1 space-y-6'>
          <div className='bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col items-center text-center'>
            <h3 className='font-semibold mb-4 w-full text-left'>Book Cover</h3>
            <div className='relative aspect-2/3 w-full max-w-50 shadow-md rounded-md overflow-hidden bg-muted mb-4'>
              <Image
                src={book.cover}
                alt={book.title}
                className='w-full h-full object-cover'
                onError={e => {
                  e.target.src = 'https://placehold.co/400x600?text=No+Cover';
                }}
              />
            </div>
            <Button
              variant='ghost'
              className='w-full text-red-500 hover:text-red-600 hover:bg-red-50 gap-2 mt-4'
              onClick={() => setIsDeleteModalOpen(true)}>
              <Trash2 size={16} />
              Delete Book
            </Button>
          </div>
        </div>
      </div>

      <DeleteBookModal
        isOpen={isDeleteModalOpen}
        onClose={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        bookTitle={book.title}
        isDeleting={isDeleting}
      />
    </>
  );
}
