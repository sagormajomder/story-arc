import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { token } = req.nextauth;

    // console.log('Middleware Debug:', {
    //   pathname,
    //   role: token?.role,
    //   tokenKeys: token ? Object.keys(token) : 'No Token',
    // });

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
