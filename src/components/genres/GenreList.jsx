'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit2, Shapes, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function GenreList({ genres }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [editingGenre, setEditingGenre] = useState(null);
  const [deletingGenre, setDeletingGenre] = useState(null);
  const [newName, setNewName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEditClick = genre => {
    setEditingGenre(genre);
    setNewName(genre.name);
  };

  const handleUpdate = async () => {
    if (!newName.trim()) return;
    setIsUpdating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/genres/${editingGenre._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ name: newName.trim() }),
        }
      );
      if (!res.ok) throw new Error('Failed to update');
      toast.success('Genre updated');
      setEditingGenre(null);
      router.refresh();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingGenre) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/genres/${deletingGenre._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        }
      );
      if (!res.ok) throw new Error('Failed to delete');
      toast.success('Genre deleted');
      setDeletingGenre(null);
      router.refresh();
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {genres.map(genre => (
          <div
            key={genre._id}
            className='group bg-card border border-border rounded-xl p-5 flex items-center justify-between hover:border-green-500/50 transition-all shadow-sm'>
            <div className='flex items-center gap-4'>
              <div className='p-3 rounded-lg bg-green-500/10 text-green-500'>
                <Shapes size={20} />
              </div>
              <div>
                <h3 className='font-bold text-foreground text-lg leading-none mb-1'>
                  {genre.name}
                </h3>
                <p className='text-xs text-muted-foreground font-medium uppercase tracking-wide'>
                  {genre.bookCount || 0} Books
                </p>
              </div>
            </div>

            <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-foreground'
                onClick={() => handleEditClick(genre)}>
                <Edit2 size={14} />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-muted-foreground hover:text-destructive'
                onClick={() => setDeletingGenre(genre)}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal (Simple conditional rendering for speed/robustness) */}
      {editingGenre && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='bg-card border border-border w-full max-w-md p-6 rounded-xl shadow-xl'>
            <h3 className='text-lg font-bold mb-4'>Edit Genre</h3>
            <Input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className='mb-4'
              autoFocus
            />
            <div className='flex justify-end gap-2'>
              <Button
                variant='secondary'
                onClick={() => setEditingGenre(null)}
                disabled={isUpdating}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                disabled={isUpdating}
                className='bg-green-500 hover:bg-green-600 text-white'>
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deletingGenre && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm'>
          <div className='bg-card border border-border w-full max-w-md p-6 rounded-xl shadow-xl'>
            <h3 className='text-lg font-bold mb-2'>Delete Genre?</h3>
            <p className='text-muted-foreground mb-6'>
              Are you sure you want to delete{' '}
              <strong>{deletingGenre.name}</strong>?
            </p>
            <div className='flex justify-end gap-2'>
              <Button
                variant='secondary'
                onClick={() => setDeletingGenre(null)}
                disabled={isDeleting}>
                Cancel
              </Button>
              <Button
                variant='destructive'
                onClick={handleDelete}
                disabled={isDeleting}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
