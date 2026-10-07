'use client';

import BookForm, { IBookFormValues } from './BookForm';
import { IGenre } from '@src/types/book';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export interface IAddBookClientWrapperProps {
  genres?: IGenre[] | string[];
}

export default function AddBookClientWrapper({
  genres = [],
}: IAddBookClientWrapperProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: IBookFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to create book');
      }

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
