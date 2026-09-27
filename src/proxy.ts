import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/forbidden', req.url));
    }

    if (pathname.startsWith('/user') && token?.role !== 'user') {
      if (token?.role !== 'user' && token?.role !== 'admin') {
        if (token?.role !== 'user') {
          return NextResponse.redirect(new URL('/forbidden', req.url));
        }
      }
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = { matcher: ['/admin/:path*', '/user/:path*'] };
