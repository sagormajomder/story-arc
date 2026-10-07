'use client';

import { ILibraryItem } from '@src/types';
import { ComponentType, FC } from 'react';
import { IBookCardLibraryProps } from './BookCardLibrary';

export interface IShelfTabProps {
  items: ILibraryItem[];
  status: string;
  onUpdate: () => void;
  loading: boolean;
  BookCard: ComponentType<IBookCardLibraryProps>;
}

const ShelfTab: FC<IShelfTabProps> = ({
  items,
  status,
  onUpdate,
  loading,
  BookCard,
}) => {
  const filteredItems = items.filter(item => item.status === status);

  if (loading) {
    return <div className='text-muted-foreground'>Loading shelf...</div>;
  }

  if (filteredItems.length === 0) {
    return (
      <div className='text-center py-10 border border-dashed border-border rounded-lg'>
        <p className='text-muted-foreground'>No books in &quot;{status}&quot; shelf.</p>
      </div>
    );
  }

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6'>
      {filteredItems.map(item => (
        <BookCard key={item.bookId} item={item} onUpdate={onUpdate} />
      ))}
    </div>
  );
};

export default ShelfTab;
