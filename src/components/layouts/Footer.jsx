import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { FiBook } from 'react-icons/fi';
import Container from './Container';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='border-t border-border bg-muted/30'>
      <Container>
        <div className='flex flex-col md:flex-row items-center justify-between gap-6 py-8'>
          {/* Logo & Brand */}
          <div className='flex flex-col items-center md:items-start gap-2'>
            <div className='flex items-center gap-2 text-primary'>
              <FiBook className='text-2xl' />
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
              <FaTwitter size={20} />
            </a>
            <a
              href='https://github.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='GitHub'>
              <FaGithub size={20} />
            </a>
            <a
              href='https://linkedin.com'
              target='_blank'
              rel='noopener noreferrer'
              className='text-muted-foreground hover:text-primary transition-colors'
              aria-label='LinkedIn'>
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className='border-t border-border py-6 text-center text-sm text-muted-foreground'>
          <p>&copy; {currentYear} Story Arc. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
