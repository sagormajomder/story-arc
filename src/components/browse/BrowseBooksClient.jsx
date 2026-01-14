'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookGrid from './BookGrid';
import FilterSidebar from './FilterSidebar';
import SearchBar from './SearchBar';
import SortSelect from './SortSelect';

import { useSession } from 'next-auth/react';

export default function BrowseBooksClient({ initialGenres }) {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalBooks, setTotalBooks] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Filters
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [page, setPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genre') ? searchParams.get('genre').split(',') : []
  );
  const [ratingRange, setRatingRange] = useState([
    searchParams.get('minRating') || 0,
    searchParams.get('maxRating') || 5,
  ]);
  const [sort, setSort] = useState(searchParams.get('sort') || 'created_desc');

  // Fetch Books
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedGenres.length > 0)
        params.append('genre', selectedGenres.join(','));
      if (ratingRange[0] > 0) params.append('minRating', ratingRange[0]);
      if (ratingRange[1] < 5) params.append('maxRating', ratingRange[1]);
      if (sort) params.append('sort', sort);
      params.append('page', page);
      params.append('limit', 12);

      // Update URL silently
      router.push(`?${params.toString()}`, { scroll: false });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/books?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to fetch books');
      const data = await res.json();

      setBooks(data.books);
      setTotalBooks(data.totalBooks);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce effect
  useEffect(() => {
    fetchBooks();
  }, [page, sort]); // trigger on page/sort change immediately

  // Debounced trigger for search/filters
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page !== 1) setPage(1); // Reset to page 1 on filter change
      else fetchBooks();
    }, 800);
    return () => clearTimeout(timer);
  }, [search, selectedGenres, ratingRange]);

  // Handlers
  const handlePageChange = newPage => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className='flex flex-col md:flex-row gap-8 min-h-screen pb-20'>
      {/* Sidebar */}
      <FilterSidebar
        genres={initialGenres}
        selectedGenres={selectedGenres}
        setSelectedGenres={setSelectedGenres}
        ratingRange={ratingRange}
        setRatingRange={setRatingRange}
      />

      {/* Main Content */}
      <div className='flex-1 space-y-6'>
        {/* Top Bar */}
        <div className='flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-lg border border-border/40 shadow-sm'>
          <SearchBar onSearch={setSearch} initialValue={search} />
          <div className='flex items-center gap-2'>
            <SortSelect value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedGenres.length > 0 ||
          ratingRange[0] > 0 ||
          ratingRange[1] < 5) && (
          <div className='flex flex-wrap gap-2'>
            {selectedGenres.map(g => (
              <span
                key={g}
                className='text-xs px-2 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full flex items-center gap-1'>
                {g}
                <button
                  onClick={() =>
                    setSelectedGenres(selectedGenres.filter(i => i !== g))
                  }
                  className='hover:text-foreground'>
                  ×
                </button>
              </span>
            ))}
            {(ratingRange[0] > 0 || ratingRange[1] < 5) && (
              <span className='text-xs px-2 py-1 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full flex items-center gap-1'>
                Rating: {ratingRange[0]} - {ratingRange[1]}
                <button
                  onClick={() => setRatingRange([0, 5])}
                  className='hover:text-foreground'>
                  ×
                </button>
              </span>
            )}
            <button
              onClick={() => {
                setSelectedGenres([]);
                setRatingRange([0, 5]);
                setSearch('');
              }}
              className='text-xs text-muted-foreground hover:text-destructive underline ml-2'>
              Clear All
            </button>
          </div>
        )}

        {/* Grid */}
        <BookGrid books={books} loading={loading} />

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className='flex justify-center gap-2 mt-12'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}>
              <ChevronLeft className='w-4 h-4' />
            </Button>
            <div className='flex items-center gap-2 px-4'>
              <span className='font-bold text-primary'>{page}</span>
              <span className='text-muted-foreground'>Of</span>
              <span className='text-muted-foreground'>{totalPages}</span>
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}>
              <ChevronRight className='w-4 h-4' />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
