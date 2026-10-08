'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@src/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@src/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from '@src/providers';
import Link from 'next/link';

export function UserProfile() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <Link
        href='/login'
        className='text-sm font-medium text-foreground hover:text-primary transition-colors'>
        Login
      </Link>
    );
  }

  const { user } = session;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='flex items-center gap-3 focus:outline-none group'>
          <div className='hidden sm:flex flex-col items-end'>
            <span className='text-sm font-semibold text-foreground group-hover:text-primary transition-colors'>
              {user.fullName || 'User'}
            </span>
            <span className='text-xs text-muted-foreground capitalize'>
              {user.role || 'User'}
            </span>
          </div>
          <Avatar size='lg' className='border border-border group-hover:border-primary transition-colors'>
            <AvatarImage
              src={user.profileImage || undefined}
              alt={user.fullName || 'User'}
            />
            <AvatarFallback className='bg-muted text-xs font-semibold'>
              {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => signOut({ callbackUrl: '/login' })}
            className='text-red-600 focus:text-red-600 cursor-pointer'>
            <LogOut className='mr-2 h-4 w-4' />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
