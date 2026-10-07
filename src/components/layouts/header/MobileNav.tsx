'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Container from '../Container';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const userImage = session?.user?.profileImage || session?.user?.image;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className='lg:hidden text-2xl text-foreground p-1'
        onClick={toggleMenu}
        aria-label='Toggle menu'>
        {isMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-background border-b border-border shadow-lg lg:hidden animate-in slide-in-from-top-2 duration-200'>
          <Container>
            <div className='py-6'>
              <NavLinks
                className='flex-col gap-4'
                onLinkClick={() => setIsMenuOpen(false)}
              />

              <hr className='border-border my-6 md:hidden' />

              <div className='pt-2 space-y-4 md:hidden'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-3'>
                    {session?.user ? (
                      <>
                        <Avatar size='lg' className='border border-border'>
                          <AvatarImage
                            src={userImage || undefined}
                            alt={session.user.name || 'User'}
                          />
                          <AvatarFallback className='bg-muted text-xs font-semibold'>
                            {session.user.name
                              ? session.user.name.charAt(0).toUpperCase()
                              : 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                          <span className='text-sm font-semibold text-foreground'>
                            {session.user.name}
                          </span>
                          <span className='text-xs text-muted-foreground capitalize'>
                            {session.user.role || 'User'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <Link
                        href='/login'
                        className='text-sm font-semibold text-foreground hover:text-primary'>
                        Login
                      </Link>
                    )}
                  </div>
                  <ThemeToggle />
                </div>

                {session?.user && (
                  <Button
                    variant='destructive'
                    size='sm'
                    className='w-full flex items-center justify-center gap-2'
                    onClick={() => signOut()}>
                    <LogOut size={16} />
                    Sign Out
                  </Button>
                )}
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
