'use client';

import { BookForm, IBookFormValues } from './BookForm';
import type { IBook, IGenre } from '../books.index';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export interface IEditBookClientWrapperProps {
  book: IBook;
  genres?: IGenre[] | string[];
}

export function EditBookFormWrapper({
  book,
  genres = [],
}: IEditBookClientWrapperProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: IBookFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books/${book._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
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

  return (
    <BookForm
      initialData={book}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      availableGenres={genres}
    />
  );
}

export { EditBookFormWrapper as EditBookClientWrapper };
