'use client';

import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Container from '../Container';
import NavLinks from './NavLinks';
import ThemeToggle from './ThemeToggle';

export default function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className='md:hidden text-2xl text-foreground p-1'
        onClick={toggleMenu}
        aria-label='Toggle menu'>
        {isMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Mobile Navigation Dropdown */}
      {isMenuOpen && (
        <div className='absolute top-full left-0 w-full bg-background border-b border-border shadow-lg md:hidden animate-in slide-in-from-top-2 duration-200'>
          <Container>
            <div className='py-6'>
              <NavLinks
                className='flex-col gap-4'
                onLinkClick={() => setIsMenuOpen(false)}
              />

              <hr className='border-border my-6' />

              <div className='flex items-center justify-between pt-2'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 rounded-full bg-secondary flex items-center justify-center overflow-hidden border border-border'>
                    <div className='h-full w-full bg-muted animate-pulse' />
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-sm font-semibold text-foreground'>
                      Admin User
                    </span>
                    <span className='text-xs text-muted-foreground'>
                      Super Admin
                    </span>
                  </div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
