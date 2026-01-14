'use client';

import {
  TutorialCard,
  TutorialSkeleton,
} from '@/components/tutorials/TutorialCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function UserTutorialList({ initialData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [searchParams]); // Reset loading when params change (data arrived)

  const handlePageChange = newPage => {
    setLoading(true);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage);
    router.push(`?${params.toString()}`);
  };

  const { tutorials, currentPage, totalPages } = initialData;

  return (
    <div>
      {/* Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12'>
        {loading
          ? Array(6)
              .fill(0)
              .map((_, i) => <TutorialSkeleton key={i} />)
          : tutorials.map(tutorial => (
              <TutorialCard key={tutorial._id} tutorial={tutorial} />
            ))}
      </div>

      {/* Pagination */}
      <div className='flex justify-center items-center gap-4'>
        <Button
          variant='ghost'
          disabled={currentPage <= 1 || loading}
          onClick={() => handlePageChange(currentPage - 1)}
          className='flex items-center gap-2 hover:bg-transparent hover:text-green-500 transition-colors disabled:opacity-50'>
          <ChevronLeft size={20} /> Previous
        </Button>

        <div className='flex gap-2'>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
            <button
              key={pageNum}
              onClick={() => handlePageChange(pageNum)}
              disabled={loading}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                currentPage === pageNum
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'bg-secondary text-muted-foreground hover:bg-secondary/80'
              }`}>
              {pageNum}
            </button>
          ))}
        </div>

        <Button
          variant='ghost'
          disabled={currentPage >= totalPages || loading}
          onClick={() => handlePageChange(currentPage + 1)}
          className='flex items-center gap-2 hover:bg-transparent hover:text-green-500 transition-colors disabled:opacity-50'>
          Next <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
