'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import ContinueReading from './ContinueReading';
import DashboardHeader from './DashboardHeader';
import ReadingStats from './ReadingStats';
import RecommendationCarousel from './RecommendationCarousel';

export default function DashboardClient() {
  const { data: session } = useSession();
  const [statsData, setStatsData] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      setLoading(true);

      try {
        const token = session.token;
        const headers = { Authorization: `Bearer ${token}` };
        const userId = session.user.id;

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
        // Better to have a specific endpoint, but let's reuse fetching logic or Library approach
        const userRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
          { headers }
        );
        if (userRes.ok) {
          const userData = await userRes.json();
          const shelf = userData.shelf || [];

          // Find first "Currently Reading" or most recently updated
          // Assuming legacy string IDs are handled or we use objects
          const activeItem = shelf.find(
            item => item.status === 'Currently Reading'
          );

          if (activeItem) {
            // We need book details.
            const bookId = activeItem.bookId; // Assuming object structure from migration
            const bookRes = await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`,
              { headers }
            ); // Assuming public or auth
            if (bookRes.ok) {
              const book = await bookRes.json();
              setCurrentBook({
                ...activeItem,
                book,
              });
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
          setRecommendations(data);
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
