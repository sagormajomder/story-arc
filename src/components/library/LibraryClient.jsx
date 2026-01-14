'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Assuming similar to standard Shadcn
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import BookCardLibrary from './BookCardLibrary';
import ShelfTab from './ShelfTab';

export default function LibraryClient() {
  const { data: session } = useSession();
  const [libraryItems, setLibraryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLibrary = async () => {
    if (!session?.user?.id) return;
    setLoading(true);
    try {
      // 1. Fetch User Data (to get shelf)
      // We could use session.user.shelf from NextAuth, but it might be stale.
      // Better to fetch fresh.
      const userRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}`,
        {
          headers: { Authorization: `Bearer ${session.token}` },
        }
      );
      if (!userRes.ok) throw new Error('Failed to fetch user');
      const userData = await userRes.json();
      const shelf = userData.shelf || [];

      if (shelf.length === 0) {
        setLibraryItems([]);
        setLoading(false);
        return;
      }

      // 2. Fetch Book Details
      const bookIds = shelf.map(item => item.bookId);

      const booksRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books?ids=${bookIds.join(
          ','
        )}&limit=1000`,
        {
          headers: { Authorization: `Bearer ${session.token}` },
        }
      );
      if (!booksRes.ok) throw new Error('Failed to fetch books');
      const booksData = await booksRes.json();
      const booksMap = new Map(booksData.books.map(b => [b._id, b]));

      // 3. Merge Data
      const mergedItems = shelf
        .map(item => {
          const book = booksMap.get(item.bookId);

          if (!book) return null;

          return {
            bookId: item.bookId,
            book,
            status: item.status || 'Want to Read',
            progress: item.progress || 0,
            totalPages: item.totalPages || book.totalPages || 0,
          };
        })
        .filter(Boolean);

      setLibraryItems(mergedItems);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.id) {
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
