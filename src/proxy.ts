import { NextRequest, NextResponse } from 'next/server';

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const refreshToken = req.cookies.get('refreshToken')?.value;
  const userRole = req.cookies.get('userRole')?.value;

  if (pathname.startsWith('/admin')) {
    if (!refreshToken) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }
  }

  if (pathname.startsWith('/user')) {
    if (!refreshToken) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*', '/user/:path*'] };
