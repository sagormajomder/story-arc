'use client';

import { Badge } from '@src/components/ui/badge';
import { ReviewFilters } from './ReviewFilters';
import { ReviewTable } from './ReviewTable';
import { reviewsApi } from '../api/reviews.api';
import type { IReview } from '../types/review.types';
import { useAuth } from '@src/providers';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export function ReviewModerationClient() {
  const { token, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const filter = searchParams.get('status') || 'pending';

  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadReviews() {
      if (authLoading) return;
      setLoading(true);
      try {
        const res = await reviewsApi.getAdminReviews(filter, token || undefined);
        if (!isMounted) return;
        setReviews(res || []);
      } catch (err) {
        console.error('Fetch reviews error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadReviews();

    return () => {
      isMounted = false;
    };
  }, [filter, token, authLoading]);

  if (loading || authLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-8'>
      <div>
        <div className='flex items-center gap-3 mb-2'>
          <h1 className='text-3xl font-bold font-serif text-foreground'>
            Review Moderation
          </h1>
          <Badge className='bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20'>
            {reviews.length} {filter.toUpperCase()}
          </Badge>
        </div>
        <p className='text-muted-foreground'>
          Manage and verify user-submitted book reviews for the platform.
        </p>
      </div>

      <ReviewFilters />

      <ReviewTable reviews={reviews} token={token || undefined} status={filter} />
    </div>
  );
}
