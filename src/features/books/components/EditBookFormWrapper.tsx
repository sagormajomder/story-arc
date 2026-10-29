'use client';

import { BookForm, IBookFormValues } from './BookForm';
import { booksApi, type IBook, type IGenre } from '../books.index';
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
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: IBookFormValues) => {
    setIsSubmitting(true);
    try {
      await booksApi.updateBook(book._id, data);

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
