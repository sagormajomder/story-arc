import { authOptions } from '@src/app/api/auth/[...nextauth]/route';
import Container from '@src/components/layouts/Container';
import { Badge } from '@src/components/ui/badge';
import { ReviewFilters, ReviewTable, reviewsApi } from '@src/features/reviews/reviews.index';
import { IReview } from '@src/types';
import { getServerSession } from 'next-auth';

interface IReviewModerationSearchParams {
  status?: string;
}

interface IReviewModerationPageProps {
  searchParams: Promise<IReviewModerationSearchParams>;
}

async function getReviews(
  token?: string,
  status: string = 'pending'
): Promise<IReview[]> {
  try {
    return await reviewsApi.getAdminReviews(status, token);
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return [];
  }
}

export default async function ReviewModerationPage({
  searchParams,
}: IReviewModerationPageProps) {
  const session = await getServerSession(authOptions);

  // Next.js 15/16: searchParams is a promise
  const params = await searchParams;
  const filter = params?.status || 'pending';

  const reviews = await getReviews(session?.token, filter);

  return (
    <Container className='p-6 space-y-8'>
      {/* Header */}
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

      <ReviewTable reviews={reviews} token={session?.token} status={filter} />
    </Container>
  );
}
