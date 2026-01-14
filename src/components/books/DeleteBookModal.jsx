'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';

export default function DeleteBookModal({
  isOpen,
  onClose,
  onConfirm,
  bookTitle,
  isDeleting,
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className='bg-popover border-border'>
        <AlertDialogHeader>
          <div className='mx-auto bg-red-100 dark:bg-red-900/20 p-3 rounded-full mb-2 w-fit'>
            <Trash2 className='w-6 h-6 text-red-600 dark:text-red-500' />
          </div>
          <AlertDialogTitle className='text-center text-xl'>
            Delete Book?
          </AlertDialogTitle>
          <AlertDialogDescription className='text-center'>
            Are you sure you want to delete{' '}
            <span className='font-bold text-foreground'>"{bookTitle}"</span>?
            <br />
            <br />
            <span className='mt-2 block text-red-500 bg-red-500/10 p-2 rounded text-sm border border-red-500/20'>
              This action cannot be undone and will remove all associated user
              progress and reviews.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='sm:justify-center gap-2 mt-4'>
          <AlertDialogCancel className='w-full sm:w-auto border-border'>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={e => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className='w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white'>
            {isDeleting ? 'Deleting...' : 'Confirm Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
