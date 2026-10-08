import { Container } from '@src/components/layouts/Container';
import { ReviewModerationClient } from '@src/features/reviews/reviews.index';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Review Moderation | Story Arc',
  description: 'Moderate and verify user reviews for books.',
};

export default function ReviewModerationPage() {
  return (
    <Container className='p-6 space-y-8'>
      <Suspense
        fallback={
          <div className='animate-pulse space-y-4'>
            <div className='h-8 bg-muted rounded w-48' />
            <div className='h-4 bg-muted rounded w-64' />
          </div>
        }>
        <ReviewModerationClient />
      </Suspense>
    </Container>
  );
}
