import { Book } from 'lucide-react';

export function Logo() {
  return (
    <div className='flex items-center gap-2 text-primary'>
      <Book className='size-7' />
      <span className='text-xl font-bold tracking-tight font-serif'>
        Story Arc
      </span>
    </div>
  );
}
