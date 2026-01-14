'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight, MoreVertical, Shield } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function UserTable({
  users,
  currentPage,
  totalPages,
  totalUsers,
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState(null);

  const handlePageChange = newPage => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = new URLSearchParams(window.location.search);
    params.set('page', newPage);
    router.replace(`?${params.toString()}`);
  };

  const handleRoleUpdate = async (userId, newRole) => {
    setUpdatingId(userId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) throw new Error('Failed to update role');

      toast.success(`User role updated to ${newRole}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className='bg-card border border-border rounded-xl shadow-sm overflow-hidden'>
      {/* Table Header Filter placeholder (optional, consistent with UI) */}
      <div className='p-4 border-b border-border flex items-center justify-between'>
        <div className='flex gap-2'>
          <Button
            variant='default'
            size='sm'
            className='bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-full h-8 px-4'>
            All Users
          </Button>
          {/* Add other filters here if needed, consistent with screenshot */}
        </div>
        <div className='text-sm text-muted-foreground'>
          {/* Date filter placeholder */}
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead>
            <tr className='border-b border-border bg-muted/30'>
              <th className='text-left py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                User
              </th>
              <th className='text-left py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                Email
              </th>
              <th className='text-left py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                Date Joined
              </th>
              <th className='text-left py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                Role
              </th>
              <th className='text-left py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                Status
              </th>
              <th className='text-right py-3 px-6 font-medium text-xs text-muted-foreground uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-border'>
            {users.map(user => (
              <tr
                key={user._id}
                className='hover:bg-muted/20 transition-colors group'>
                <td className='py-4 px-6'>
                  <div className='flex items-center gap-3'>
                    <Avatar className='h-9 w-9 border border-border'>
                      <AvatarImage src={user.image} alt={user.name} />
                      <AvatarFallback className='bg-secondary text-xs'>
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className='font-medium text-foreground text-sm'>
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className='py-4 px-6 text-sm text-muted-foreground'>
                  {user.email}
                </td>
                <td className='py-4 px-6 text-sm text-muted-foreground'>
                  {user.createdAt
                    ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                    : 'N/A'}
                </td>
                <td className='py-4 px-6'>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                      user.role === 'admin'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20'
                        : 'bg-secondary text-muted-foreground border-border'
                    }`}>
                    {user.role === 'admin' && (
                      <Shield className='w-3 h-3 mr-1' />
                    )}
                    {user.role === 'admin' ? 'ADMIN' : 'USER'}
                  </span>
                </td>
                <td className='py-4 px-6'>
                  <div className='flex items-center gap-2'>
                    <div className='w-1.5 h-1.5 rounded-full bg-green-500' />
                    <span className='text-sm text-green-500 font-medium'>
                      Active
                    </span>
                  </div>
                </td>
                <td className='py-4 px-6 text-right'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity'
                        disabled={updatingId === user._id}>
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleUpdate(
                            user._id,
                            user.role === 'admin' ? 'user' : 'admin'
                          )
                        }>
                        {user.role === 'admin'
                          ? 'Remove Admin Role'
                          : 'Make Admin'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='p-4 border-t border-border flex items-center justify-between'>
        <span className='text-sm text-muted-foreground'>
          Showing <span className='font-medium'>{users.length}</span> of{' '}
          <span className='font-medium'>{totalUsers}</span> users
        </span>
        <div className='flex items-center gap-2'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className='h-8 w-8 p-0'>
            <ChevronLeft size={16} />
          </Button>
          <span className='text-sm font-medium'>{currentPage}</span>
          <Button
            variant='outline'
            size='sm'
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className='h-8 w-8 p-0'>
            <ChevronRight size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
