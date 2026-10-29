'use client';

import type { IBook } from '@src/features/books/books.index';
import { libraryApi } from '@src/features/library/library.index';
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
      if (!session?.user) return;
      setLoading(true);

      try {
        // 1. Fetch Reading Stats & Goal from /shelf/stats
        const stats = await libraryApi.getStats();
        setStatsData({
          stats: {
            totalPagesRead: stats.totalPagesRead,
            streak: stats.currentStreak,
          },
          goal: stats.readingGoal
            ? {
                current: stats.readingGoal.booksRead,
                target: stats.readingGoal.targetBooks,
              }
            : undefined,
        });

        // 2. Fetch User Shelf to find "Currently Reading" book
        const shelfRes = await libraryApi.getMyShelf({
          status: 'Currently Reading',
          limit: 1,
        });

        if (shelfRes.items && shelfRes.items.length > 0) {
          const activeItem = shelfRes.items[0];
          setCurrentBook({
            book: activeItem.book,
            progress: activeItem.progress || 0,
            status: activeItem.status,
          });
        } else {
          setCurrentBook(null);
        }

        // 3. Fetch Recommendations
        const recData = await libraryApi.getRecommendations();
        setRecommendations(recData);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
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
