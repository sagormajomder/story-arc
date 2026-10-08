import { GithubIcon, LinkedinIcon, TwitterIcon } from '@src/components/icons';
import { Book } from 'lucide-react';
import React from 'react';
import { Container } from './Container';
import { CurrentYear } from './CurrentYear';

export function Footer() {
  return (
    <footer className='border-t border-border bg-muted/30'>
      <Container>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 py-8'>
          {/* Logo & Brand */}
          <div className='flex flex-col items-center md:items-start gap-2'>
            <div className='flex items-center gap-2 text-primary'>
              <Book className='size-6' />
              <span className='text-lg font-bold tracking-tight font-serif'>
                Story Arc
              </span>
            </div>
            <p className='text-sm text-muted-foreground text-center md:text-left'>
              Crafting stories, one chapter at a time.
            </p>
          </div>

          {/* Social Links */}
          <div className='flex items-center gap-4'>
            <a
              href='https://twitter.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='Twitter'>
              <TwitterIcon size={20} />
            </a>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='GitHub'>
              <GithubIcon size={20} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='LinkedIn'>
              <LinkedinIcon size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-border py-6 text-center text-sm text-muted-foreground'>
          <p>&copy; <CurrentYear /> Story Arc. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
