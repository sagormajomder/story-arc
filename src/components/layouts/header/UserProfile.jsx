'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserProfile() {
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
              {user.name || 'User'}
            </span>
            <span className='text-xs text-muted-foreground capitalize'>
              {user.role || session.role || 'User'}
            </span>
          </div>
          <div className='h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border relative group-hover:border-primary transition-colors'>
            {user.profileImage ? (
              <Image
                src={user.profileImage}
                alt={user.name}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-cover'
              />
            ) : (
              <div className='h-full w-full bg-muted flex items-center justify-center text-xs'>
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-56'>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/login' })}
          className='text-red-600 focus:text-red-600 cursor-pointer'>
          <LogOut className='mr-2 h-4 w-4' />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
