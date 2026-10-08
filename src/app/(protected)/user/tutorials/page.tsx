import { tutorialsApi, UserTutorialList } from '@src/features/tutorials/tutorials.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

interface ITutorialsPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getTutorials(page = 1) {
  try {
    return await tutorialsApi.getTutorials(page, 9);
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return { tutorials: [], totalTutorials: 0, totalPages: 0, currentPage: 1 };
  }
}

async function TutorialsContent({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const data = await getTutorials(currentPage);
  return <UserTutorialList initialData={data} />;
}

export default function TutorialsPage({ searchParams }: ITutorialsPageProps) {
  return (
    <div className='p-8 max-w-7xl mx-auto space-y-12'>
      {/* Hero Section */}
      <div className='max-w-2xl'>
        <h1 className='text-4xl font-serif font-bold text-foreground mb-4'>
          Video Tutorials & Tips
        </h1>
        <p className='text-muted-foreground text-lg'>
          Master your reading journey with our curated guides, from setting up
          your digital library to hitting your yearly reading goals.
        </p>
      </div>

      <Suspense
        fallback={
          <div className='flex justify-center py-12'>
            <Loader2 className='w-8 h-8 animate-spin text-primary' />
          </div>
        }>
        <TutorialsContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
