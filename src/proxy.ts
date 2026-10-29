import { NextRequest, NextResponse } from 'next/server';
import { isAdminRole } from '@src/lib/utils';

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isLoggedIn =
    req.cookies.get('isLoggedIn')?.value === 'true' ||
    Boolean(req.cookies.get('authUser')?.value) ||
    Boolean(req.cookies.get('refreshToken')?.value);
  const userRole = req.cookies.get('userRole')?.value;
  const isAdmin = isAdminRole(userRole);

  // 1. Admin Routes: require logged-in and admin role
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }
  }

  // 2. User Routes: require logged-in
  if (pathname.startsWith('/user')) {
    if (!isLoggedIn) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 3. Guest/Auth Routes: if already logged in, redirect to appropriate area
  if (pathname === '/login' || pathname === '/register') {
    if (isLoggedIn) {
      const targetUrl = isAdmin ? '/admin/dashboard' : '/user/library';
      return NextResponse.redirect(new URL(targetUrl, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/login', '/register'],
};
