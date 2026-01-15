'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ReviewFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentFilter = searchParams.get('status') || 'pending';

  const handleFilterChange = filter => {
    const params = new URLSearchParams(searchParams);
    params.set('status', filter);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className='flex items-center gap-6 border-b border-border text-sm font-medium'>
      <button
        onClick={() => handleFilterChange('pending')}
        className={`pb-3 border-b-2 transition-colors ${
          currentFilter === 'pending'
            ? 'border-green-500 text-green-500'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}>
        Pending
      </button>
      <button
        onClick={() => handleFilterChange('approved')}
        className={`pb-3 border-b-2 transition-colors ${
          currentFilter === 'approved'
            ? 'border-green-500 text-green-500'
            : 'border-transparent text-muted-foreground hover:text-foreground'
        }`}>
        Approved
      </button>
    </div>
  );
}
