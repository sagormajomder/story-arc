'use client';

import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function SearchBar({ onSearch, initialValue = '' }) {
  const [value, setValue] = useState(initialValue);

  const debouncedValue = useDebounce(value, 500);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className='relative w-full md:w-96'>
      <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4' />
      <Input
        value={value}
        onChange={e => setValue(e.target.value)}
        placeholder='Search by title, author, or ISBN...'
        className='pl-10 bg-secondary/50 border-input/50 focus-visible:ring-primary/20 transition-all font-sans'
      />
    </div>
  );
}
