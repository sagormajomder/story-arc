'use client';

import BookForm from '@/components/books/BookForm';
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
    <BookForm
      initialData={book}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
}
