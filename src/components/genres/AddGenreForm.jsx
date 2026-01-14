'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AddGenreForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/genres`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: name.trim() }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create genre');
      }

      toast.success('Genre created successfully');
      setName('');
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='bg-card border border-border rounded-xl p-6 shadow-sm mb-8'>
      <div className='mb-6'>
        <h2 className='text-xl font-bold text-foreground'>Create New Genre</h2>
        <p className='text-sm text-muted-foreground mt-1'>
          Add a new category to the library catalog.
        </p>
      </div>

      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='flex-1 space-y-2'>
          <label
            htmlFor='genreName'
            className='text-sm font-medium text-muted-foreground'>
            Genre Name
          </label>
          <Input
            id='genreName'
            placeholder='e.g., Historical Fiction'
            value={name}
            onChange={e => setName(e.target.value)}
            disabled={isSubmitting}
            className='bg-background/50'
          />
        </div>
        <div className='flex items-end'>
          <Button
            type='submit'
            disabled={isSubmitting || !name.trim()}
            className='w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white font-medium min-w-[140px]'>
            {isSubmitting ? (
              'Creating...'
            ) : (
              <>
                <Plus className='mr-2 h-4 w-4' /> Create Genre
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
