'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
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
                        <div className='h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border relative'>
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name}
                              fill
                              sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                              className='object-cover'
                            />
                          ) : (
                            <div className='h-full w-full bg-muted flex items-center justify-center text-xs'>
                              {session.user.name
                                ? session.user.name.charAt(0).toUpperCase()
                                : 'U'}
                            </div>
                          )}
                        </div>
                        <div className='flex flex-col'>
                          <span className='text-sm font-semibold text-foreground'>
                            {session.user.name}
                          </span>
                          <span className='text-xs text-muted-foreground capitalize'>
                            {session.user.role || session.role}
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
