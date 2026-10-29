'use client';

import { BookForm, IBookFormValues } from './BookForm';
import { booksApi, type IGenre } from '../books.index';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export interface IAddBookClientWrapperProps {
  genres?: IGenre[] | string[];
}

export function AddBookFormWrapper({
  genres = [],
}: IAddBookClientWrapperProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: IBookFormValues) => {
    setIsSubmitting(true);
    try {
      await booksApi.createBook(data);

      toast.success('Book created successfully!');
      router.push('/admin/manage-books');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create book');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <BookForm
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      availableGenres={genres}
    />
  );
}

export { AddBookFormWrapper as AddBookClientWrapper };
