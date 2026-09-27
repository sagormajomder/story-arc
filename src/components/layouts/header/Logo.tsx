import { FiBook } from 'react-icons/fi';

export default function Logo() {
  return (
    <div className='flex items-center gap-2 text-primary'>
      <FiBook className='text-3xl' />
      <span className='text-xl font-bold tracking-tight font-serif'>
        Story Arc
      </span>
    </div>
  );
}
