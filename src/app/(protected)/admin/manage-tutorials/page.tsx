import { ManageTutorialsClient, tutorialsApi } from '@src/features/tutorials/tutorials.index';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

interface IManageTutorialsPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getTutorials(page = 1) {
  try {
    return await tutorialsApi.getTutorials(page, 5);
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return { tutorials: [], totalTutorials: 0, totalPages: 1, currentPage: 1 };
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
  return <ManageTutorialsClient data={data} />;
}

export default function ManageTutorialsPage({
  searchParams,
}: IManageTutorialsPageProps) {
  return (
    <div className='p-8 max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-serif font-bold text-foreground'>
          Manage Tutorials
        </h1>
        <p className='text-muted-foreground mt-1'>
          Create, organize, and monitor video guides for your reading community.
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
