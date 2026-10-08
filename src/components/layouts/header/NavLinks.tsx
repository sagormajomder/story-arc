'use client';

import { useSession } from '@src/providers';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Route } from 'next';

export interface INavLinkItem {
  name: string;
  href: Route | string;
}

export interface INavLinksProps {
  className?: string;
  onLinkClick?: () => void;
}

export function NavLinks({ className = '', onLinkClick }: INavLinksProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  let links: INavLinkItem[] = [];

  if (role === 'admin') {
    links = [
      { name: 'Dashboard', href: '/admin/dashboard' },
      { name: 'Manage Books', href: '/admin/manage-books' },
      { name: 'Review Moderation', href: '/admin/reviews' },
      { name: 'Manage Genres', href: '/admin/manage-genres' },
      { name: 'Manage Tutorials', href: '/admin/manage-tutorials' },
      { name: 'Manage Users', href: '/admin/manage-users' },
    ];
  } else if (role === 'user') {
    links = [
      { name: 'Dashboard', href: '/user/dashboard' },
      { name: 'My Library', href: '/user/library' },
      { name: 'Books', href: '/user/books' },
      { name: 'Tutorials', href: '/user/tutorials' },
    ];
  }

  return (
    <ul
      className={`flex gap-6 text-sm font-medium text-muted-foreground ${className}`}>
      {links.map(link => (
        <li
          key={link.name}
          className={`cursor-pointer transition-colors ${
            pathname === link.href
              ? 'text-primary font-bold'
              : 'hover:text-primary'
          }`}
          onClick={onLinkClick}>
          <Link href={link.href as Route}>{link.name}</Link>
        </li>
      ))}
    </ul>
  );
}
