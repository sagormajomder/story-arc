'use client';

export default function SortSelect({ value, onChange }) {
  return (
    <div className='relative'>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className='w-[180px] h-10 px-3 py-2 bg-secondary/50 border border-input/50 rounded-md text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer'>
        <option value='created_desc'>Newest Arrivals</option>
        <option value='rating_desc'>Highest Rated</option>
        <option value='shelved_desc'>Most Popular</option>
        <option value='title_asc'>Title (A-Z)</option>
        <option value='title_desc'>Title (Z-A)</option>
      </select>
      <div className='absolute right-3 top-3 pointer-events-none'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='16'
          height='16'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
          className='lucide lucide-chevron-down w-4 h-4 opacity-50'>
          <path d='m6 9 6 6 6-6' />
        </svg>
      </div>
    </div>
  );
}
