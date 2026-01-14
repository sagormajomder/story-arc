'use client';

import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ReviewTable({ reviews, token, status }) {
  const router = useRouter();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleApprove = async id => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${id}/approve`,
        {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success('Review verified successfully');
        router.refresh();
      } else {
        toast.error('Approval failed');
      }
    } catch (error) {
      toast.error('Error verifying review');
    }
  };

  const handleDeleteClick = id => {
    setReviewToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!reviewToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/reviews/${reviewToDelete}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        toast.success('Review deleted');
        setDeleteModalOpen(false);
        router.refresh();
      } else {
        toast.error('Delete failed');
      }
    } catch (error) {
      toast.error('Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Toaster position='top-right' reverseOrder={false} />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title='Delete Review?'
        description='Are you sure you want to delete this review'
        itemName={
          reviews.find(r => r._id === reviewToDelete)?.userName + "'s review"
        }
        warningText='This action cannot be undone.'
        isDeleting={isDeleting}
      />

      <Card className='border border-border bg-card/50 overflow-hidden'>
        {/* Table Header */}
        <div className='grid grid-cols-12 gap-4 p-4 border-b border-border bg-muted/20 text-xs font-bold text-muted-foreground uppercase tracking-wider'>
          <div className='col-span-3'>Reviewer</div>
          <div className='col-span-3'>Book Detail</div>
          <div className='col-span-2'>Rating</div>
          <div className='col-span-2'>Review Content</div>
          <div className='col-span-2 text-right'>Actions</div>
        </div>

        {/* Table Body */}
        <div className='divide-y divide-border'>
          {reviews.length === 0 ? (
            <div className='p-8 text-center text-muted-foreground'>
              No {status} reviews found.
            </div>
          ) : (
            reviews.map(review => (
              <div
                key={review._id}
                className='grid grid-cols-12 gap-4 p-4 items-center hover:bg-muted/5 transition-colors'>
                {/* Reviewer */}
                <div className='col-span-3 flex items-center gap-3'>
                  <Avatar className='h-10 w-10 border border-border'>
                    <AvatarImage src={review.userImage} />
                    <AvatarFallback className='bg-secondary text-secondary-foreground'>
                      {review.userName?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className='font-bold text-sm text-foreground'>
                      {review.userName}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {review.userEmail}
                    </p>
                  </div>
                </div>

                {/* Book Detail */}
                <div className='col-span-3 flex items-center gap-3'>
                  <div className='relative h-12 w-8 shrink-0 rounded overflow-hidden bg-secondary'>
                    {review.bookCover ? (
                      <Image
                        src={review.bookCover}
                        alt={review.bookTitle || 'Book'}
                        fill
                        className='object-cover'
                        sizes='32px'
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-[8px] text-muted-foreground'>
                        No Cover
                      </div>
                    )}
                  </div>
                  <div className='truncate'>
                    <p className='font-bold text-sm text-foreground truncate'>
                      {review.bookTitle}
                    </p>
                    <p className='text-xs text-muted-foreground truncate'>
                      {review.bookAuthor}
                    </p>
                  </div>
                </div>

                {/* Rating */}
                <div className='col-span-2'>
                  <Badge
                    variant='secondary'
                    className='bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20'>
                    ★ {review.rating}/5
                  </Badge>
                </div>

                {/* Content */}
                <div className='col-span-2'>
                  <p className='text-xs text-muted-foreground line-clamp-2 italic'>
                    "{review.comment}"
                  </p>
                </div>

                {/* Actions */}
                <div className='col-span-2 flex justify-end gap-2'>
                  <Button
                    size='sm'
                    variant='ghost'
                    onClick={() => handleDeleteClick(review._id)}
                    className='h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-500/10'>
                    <Trash2 size={16} />
                  </Button>
                  {status === 'pending' && (
                    <Button
                      size='sm'
                      onClick={() => handleApprove(review._id)}
                      className='bg-green-500 hover:bg-green-600 text-white h-8 px-4 text-xs font-bold'>
                      <Check size={14} className='mr-1.5' />
                      Approve
                    </Button>
                  )}
                  {status === 'approved' && (
                    <Badge
                      variant='outline'
                      className='bg-green-500/10 text-green-600 border-green-500/20 h-8 px-3'>
                      <Check size={12} className='mr-1.5' />
                      Verified
                    </Badge>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </>
  );
}
