'use client';

import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import Container from '../Container';
import NavLinks from './NavLinks';

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

              {/* Mobile User Profile */}
              <div className='flex items-center gap-3 pt-2'>
                {/* Reusing UserProfile might have styling issues if it hides name on SM, but let's see. 
                      Actually, UserProfile hides name on 'hidden sm:flex'. 
                      For mobile menu, we probably want to show it. 
                      Let's Inline the structure here for better mobile control or adjust UserProfile.
                      The plan said "reusing... logic/markup if needed". 
                      Standard UserProfile hides text on mobile (< sm). 
                      In the dropdown, we want to show it.
                      I'll duplicate the structure here effectively to ensure visibility, similar to original implementation.
                  */}
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
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
