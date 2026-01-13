import Container from './Container';
import Logo from './header/Logo';
import MobileNav from './header/MobileNav';
import NavLinks from './header/NavLinks';
import UserProfile from './header/UserProfile';

export default function Header() {
  return (
    <header className='sticky top-0 z-50 py-4 shadow-sm bg-background/80 backdrop-blur-md border-b border-border'>
      <Container>
        <nav className='flex items-center justify-between gap-10'>
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation Links */}
          <NavLinks className='hidden md:flex items-center' />

          {/* User Profile (Desktop) */}
          <div className='hidden md:flex'>
            <UserProfile />
          </div>

          {/* Mobile Menu */}
          <MobileNav />
        </nav>
      </Container>
    </header>
  );
}
