import UserTutorialList from '@/components/tutorials/UserTutorialList';

interface ITutorialsPageProps {
  searchParams: Promise<{ page?: string }>;
}

async function getTutorials(page = 1) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutorials?page=${page}&limit=9`,
      {
        cache: 'no-store',
      }
    );
    if (!res.ok)
      return { tutorials: [], totalTutorials: 0, totalPages: 0, currentPage: 1 };
    return await res.json();
  } catch (error) {
    console.error('Failed to fetch tutorials:', error);
    return { tutorials: [], totalTutorials: 0, totalPages: 0, currentPage: 1 };
  }
}

export default async function TutorialsPage({ searchParams }: ITutorialsPageProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const data = await getTutorials(currentPage);

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

      <UserTutorialList initialData={data} />
    </div>
  );
}
