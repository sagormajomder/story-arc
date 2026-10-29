'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@src/components/ui/tabs';
import type { IBook } from '@src/features/books/books.index';
import type { ILibraryItem } from '../library.index';
import { libraryApi } from '../api/library.api';
import { useSession } from '@src/providers';
import { useEffect, useState } from 'react';
import { BookCardLibrary } from './BookCardLibrary';
import { ShelfTab } from './ShelfTab';

export function LibraryClient() {
  const { data: session } = useSession();
  const [libraryItems, setLibraryItems] = useState<ILibraryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getMyShelf({ limit: 100 });
      const items: ILibraryItem[] = (res.items || []).map((item) => ({
        bookId: item.bookId,
        book: item.book,
        status: item.status || 'Want to Read',
        progress: item.progress || 0,
        totalPages: item.totalPages || item.book?.totalPages || 0,
      }));

      setLibraryItems(items);
    } catch (error) {
      console.error('Failed to fetch library:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      fetchLibrary();
    }
  }, [session]);

  return (
    <div className='space-y-8'>
      <div className='bg-card p-6 rounded-lg border border-border'>
        <h1 className='text-3xl font-serif font-bold text-foreground'>
          My Library
        </h1>
        <p className='text-muted-foreground mt-2'>
          Manage your collection and track your reading journey.
        </p>
      </div>

      <Tabs defaultValue='Currently Reading' className='w-full'>
        <TabsList className='flex flex-col sm:grid w-full sm:grid-cols-3 max-w-[600px] mb-8 h-auto sm:h-12 bg-secondary/50 p-1 gap-2 sm:gap-0'>
          <TabsTrigger
            value='Want to Read'
            className='data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-bold font-serif'>
            Want to Read
          </TabsTrigger>
          <TabsTrigger
            value='Currently Reading'
            className='data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-bold font-serif'>
            Currently Reading
          </TabsTrigger>
          <TabsTrigger
            value='Read'
            className='data-[state=active]:bg-background data-[state=active]:text-foreground text-muted-foreground font-bold font-serif'>
            Read
          </TabsTrigger>
        </TabsList>

        <TabsContent value='Want to Read' className='mt-0'>
          <ShelfTab
            items={libraryItems}
            status='Want to Read'
            onUpdate={fetchLibrary}
            loading={loading}
            BookCard={BookCardLibrary}
          />
        </TabsContent>
        <TabsContent value='Currently Reading' className='mt-0'>
          <ShelfTab
            items={libraryItems}
            status='Currently Reading'
            onUpdate={fetchLibrary}
            loading={loading}
            BookCard={BookCardLibrary}
          />
        </TabsContent>
        <TabsContent value='Read' className='mt-0'>
          <ShelfTab
            items={libraryItems}
            status='Read'
            onUpdate={fetchLibrary}
            loading={loading}
            BookCard={BookCardLibrary}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
