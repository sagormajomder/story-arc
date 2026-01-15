import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Container from '@/components/layouts/Container';
import { Badge } from '@/components/ui/badge';
import { getServerSession } from 'next-auth';
import ReviewFilters from '../../../../components/pages/adminPages/ReviewModerationPage/ReviewFilters';
import ReviewTable from '../../../../components/pages/adminPages/ReviewModerationPage/ReviewTable';

async function getReviews(token, status) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/reviews/admin/all?status=${status}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store', // Ensure fresh data on every request
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error('Fetch reviews error:', error);
    return [];
  }
}

export default async function ReviewModerationPage({ searchParams }) {
  const session = await getServerSession(authOptions);

  // Next.js 15: searchParams is a promise
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
