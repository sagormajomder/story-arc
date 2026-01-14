'use client';

import { Button } from '@/components/ui/button'; // Assuming we have these or use standard buttons
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function BookCardLibrary({ item, onUpdate }) {
  const book = item.book;
  const { data: session } = useSession();

  const [isUpdating, setIsUpdating] = useState(false);
  const [progress, setProgress] = useState(item.progress || 0);
  const [loading, setLoading] = useState(false);

  // Parse totalPages carefully
  const totalPages =
    typeof book.totalPages === 'number' ? book.totalPages : 300;
  // Ensure progress doesn't exceed total
  const currentProgress = Math.min(progress, totalPages);
  const percentage = Math.min(
    100,
    Math.round((currentProgress / totalPages) * 100)
  );

  const handleUpdateProgress = async (newStatus = item.status) => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${session.user.id}/shelf/${book._id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({
            progress: currentProgress,
            totalPages,
            status: newStatus,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed to update progress');

      const data = await res.json();
      toast.success('Progress updated');
      setIsUpdating(false);
      onUpdate(); // Refresh parent
    } catch (error) {
      console.error(error);
      toast.error('Failed to update progress');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    setProgress(totalPages);
    handleUpdateProgress('Read');
  };

  return (
    <div className='bg-card border border-border rounded-xl p-6 flex flex-col md:flex-row gap-6 shadow-sm hover:border-primary/20 transition-colors'>
      <Link
        href={`/user/books/${book._id}`}
        className='shrink-0 w-32 h-48 relative rounded-lg overflow-hidden shadow-md group'>
        <Image
          src={book.cover}
          alt={book.title}
          fill
          className='object-cover group-hover:scale-105 transition-transform duration-500'
        />
      </Link>

      <div className='flex-1 flex flex-col justify-between py-1'>
        <div>
          <div className='flex justify-between items-start mb-2'>
            {item.status === 'Currently Reading' && (
              <span className='text-[10px] font-bold tracking-widest text-green-500 uppercase mb-2 block'>
                IN PROGRESS
              </span>
            )}
          </div>

          <h3 className='font-serif font-bold text-2xl text-foreground mb-1 line-clamp-1'>
            {book.title}
          </h3>
          <p className='text-sm text-muted-foreground mb-4'>
            {book.author} • {book.genre || 'Fiction'}
          </p>

          {/* Progress Section */}
          {item.status === 'Currently Reading' && (
            <div className='space-y-2 mb-6'>
              <div className='flex justify-between items-end text-sm'>
                <span className='font-medium text-muted-foreground'>
                  Progress:{' '}
                  <span className='text-foreground font-bold'>
                    {currentProgress}
                  </span>{' '}
                  / {totalPages} pages
                </span>
                <span className='font-bold text-green-500'>{percentage}%</span>
              </div>
              <div className='h-3 bg-secondary/30 rounded-full overflow-hidden'>
                <div
                  className='h-full bg-green-500 rounded-full transition-all duration-500 ease-out'
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-wrap gap-3 mt-auto'>
          {item.status === 'Currently Reading' ? (
            <>
              {isUpdating ? (
                <div className='flex items-center gap-2 w-full animate-in fade-in slide-in-from-left-2 duration-200'>
                  <Input
                    type='number'
                    value={progress}
                    onChange={e => setProgress(Number(e.target.value))}
                    className='w-24 h-10 bg-background/50'
                    max={totalPages}
                    autoFocus
                  />
                  <Button
                    onClick={() => handleUpdateProgress()}
                    disabled={loading}
                    className='bg-green-500 hover:bg-green-600 text-black font-bold'>
                    Save
                  </Button>
                  <Button variant='ghost' onClick={() => setIsUpdating(false)}>
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    onClick={() => setIsUpdating(true)}
                    className='bg-green-500 hover:bg-green-600 text-black font-bold px-6'>
                    <svg
                      className='w-4 h-4 mr-2'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth='2'
                        d='M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z'></path>
                    </svg>
                    Update Progress
                  </Button>
                  <Button
                    variant='secondary'
                    onClick={handleFinish}
                    className='bg-secondary/50 hover:bg-secondary text-foreground font-medium px-6'>
                    Finish Book
                  </Button>
                </>
              )}
            </>
          ) : (
            <div className='flex gap-2'>
              {item.status === 'Read' ? (
                <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-500'>
                  Completed
                </span>
              ) : (
                <Button
                  size='sm'
                  onClick={() => handleUpdateProgress('Currently Reading')}
                  className='bg-primary text-primary-foreground'>
                  Start Reading
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
