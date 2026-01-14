import ManageTutorialsClient from '../../../../components/pages/adminPages/manageTutorialPage/ManageTutorialsClient';

async function getTutorials(page = 1) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/tutorials?page=${page}&limit=5`,
    {
      cache: 'no-store',
    }
  );
  if (!res.ok)
    return { tutorials: [], totalTutorials: 0, totalPages: 1, currentPage: 1 };
  return res.json();
}

export default async function ManageTutorialsPage({ searchParams }) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const data = await getTutorials(currentPage);

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

      <ManageTutorialsClient data={data} />
    </div>
  );
}
