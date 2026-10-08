'use client';

import type { IBook } from '@src/features/books/books.index';
import type { IUser } from '@src/features/users/users.index';
import { useSession } from '@src/providers';
import { useEffect, useState } from 'react';
import { ContinueReading, ICurrentBookItem } from './ContinueReading';
import { DashboardHeader, IDashboardStats, IReadingGoal } from './DashboardHeader';
import { ReadingStats } from './ReadingStats';
import { RecommendationCarousel } from './RecommendationCarousel';

export interface IDashboardStatsResponse {
  stats?: IDashboardStats;
  goal?: IReadingGoal;
}

export function DashboardClient() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState<IDashboardStatsResponse | null>(null);
  const [recommendations, setRecommendations] = useState<IBook[]>([]);
  const [currentBook, setCurrentBook] = useState<ICurrentBookItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const userId = session?.user?.id || session?.user?._id;
      if (!userId) return;
      setLoading(true);

      try {
        const token = session.token;
        const headers: HeadersInit = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch Stats & Goals
        const statsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/stats`,
          { headers }
        );
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStatsData(data);
        }

        // 2. Fetch User Shelf to find "Currently Reading"
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          { headers }
        );
        if (userRes.ok) {
          const userData: IUser = await userRes.json();
          const shelf = userData.shelf || [];

          // Find first "Currently Reading" or most recently updated
          const activeItem = shelf.find(
            item => item.status === 'Currently Reading' || item.status === 'reading'
          );

          if (activeItem) {
            const bookId = typeof activeItem.bookId === 'string' ? activeItem.bookId : activeItem.bookId?._id;
            if (bookId) {
              const bookRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`,
                { headers }
              );
              if (bookRes.ok) {
                const book: IBook = await bookRes.json();
                setCurrentBook({
                  book,
                  progress: 0,
                  status: activeItem.status,
                });
              }
            }
          }
        }

        // 3. Fetch Recommendations
        const recRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/recommendations`,
          { headers }
        );
        if (recRes.ok) {
          const data = await recRes.json();
          setRecommendations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Dashboard fetch error', error);
      } finally {
        setLoading(false);
      }
    }

    if (session) fetchData();
  }, [session]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center text-green-500'>
        Loading your dashboard...
      </div>
    );
  }

  return (
    <div className='space-y-12 pb-20'>
      <DashboardHeader stats={statsData?.stats} goal={statsData?.goal} />

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-2 space-y-12'>
          <ContinueReading currentBook={currentBook} />
          <RecommendationCarousel books={recommendations} />
        </div>

        <div className='space-y-8'>
          <ReadingStats stats={statsData?.stats} />
        </div>
      </div>
    </div>
  );
}
