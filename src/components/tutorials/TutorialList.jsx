'use client';

import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Edit2, RefreshCw, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import DeleteTutorialModal from './DeleteTutorialModal';

export default function TutorialList({
  tutorials,
  currentPage,
  totalPages,
  totalTutorials,
  onEdit,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    tutorial: null,
  });

  const confirmDelete = async () => {
    const { tutorial } = deleteModal;
    if (!tutorial) return;

    // Optimistically close modal
    setDeleteModal({ open: false, tutorial: null });

    const deletePromise = fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/tutorials/${tutorial._id}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      }
    ).then(async res => {
      if (!res.ok) throw new Error('Failed to delete');
      router.refresh();
      return res;
    });

    toast.promise(deletePromise, {
      loading: 'Deleting...',
      success: 'Tutorial deleted',
      error: 'Failed to delete',
    });
  };

  const handlePageChange = newPage => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className='bg-card border border-border rounded-xl flex flex-col h-full'>
      <DeleteTutorialModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, tutorial: null })}
        onConfirm={confirmDelete}
        title={deleteModal.tutorial?.title}
      />

      <div className='p-4 border-b border-border flex items-center justify-between'>
        <h3 className='font-bold text-lg'>Live Tutorials</h3>
        <div className='flex gap-2'>
          <Button variant='ghost' size='icon' onClick={() => router.refresh()}>
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      <div className='flex-1 overflow-auto'>
        <table className='w-full'>
          <thead className='bg-muted/30 text-xs text-muted-foreground uppercase'>
            <tr>
              <th className='text-left p-4'>Tutorial Preview</th>
              <th className='text-left p-4'>Category</th>
              <th className='text-left p-4'>Status</th>
              <th className='text-right p-4'>Actions</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {tutorials.length === 0 ? (
              <tr>
                <td
                  colSpan='4'
                  className='p-8 text-center text-muted-foreground'>
                  No tutorials found. Add one to get started.
                </td>
              </tr>
            ) : (
              tutorials.map(tutorial => (
                <tr
                  key={tutorial._id}
                  className='hover:bg-muted/20 transition-colors'>
                  <td className='p-4'>
                    <div className='flex gap-3'>
                      <div className='relative w-24 h-14 bg-black rounded-md overflow-hidden shrink-0'>
                        <Image
                          src={tutorial.thumbnail}
                          alt={tutorial.title}
                          fill
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                          className='object-cover opacity-90'
                        />
                      </div>
                      <div className='flex flex-col justify-center'>
                        <p className='font-medium text-sm line-clamp-1'>
                          {tutorial.title}
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          Added {format(new Date(tutorial.createdAt), 'MMM dd')}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className='p-4'>
                    <span className='bg-purple-500/10 text-purple-500 text-xs px-2 py-1 rounded-md uppercase font-bold tracking-wider'>
                      {tutorial.category}
                    </span>
                  </td>
                  <td className='p-4'>
                    <div className='flex items-center gap-2'>
                      <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                      <span className='text-sm text-green-500 font-medium'>
                        Published
                      </span>
                    </div>
                  </td>
                  <td className='p-4 text-right'>
                    <div className='flex justify-end gap-2'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => onEdit(tutorial)}
                        className='h-8 w-8 hover:bg-secondary rounded-lg'>
                        <Edit2 size={16} className='text-muted-foreground' />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => setDeleteModal({ open: true, tutorial })}
                        className='h-8 w-8 hover:bg-red-500/10 hover:text-red-500 rounded-lg'>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='p-4 border-t border-border flex items-center justify-between'>
        <span className='text-sm text-muted-foreground'>
          Showing {tutorials.length} of {totalTutorials} tutorials
        </span>
        <div className='flex gap-2'>
          <Button
            variant='secondary'
            size='sm'
            disabled={currentPage <= 1}
            onClick={() => handlePageChange(currentPage - 1)}>
            Previous
          </Button>
          <Button
            variant='secondary'
            size='sm'
            disabled={currentPage >= totalPages}
            onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
