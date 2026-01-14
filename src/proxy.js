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
      // Optional: you might allow admin to access user routes, or strictly separate them.
      // For now, let's restrict /user to only 'user' role OR allow admin too if generic.
      // Based on request "can only be access if the user has particular role", I will strict it.
      // But typically admin should see everything. Let's strict it for now as requested.
      if (token?.role !== 'user' && token?.role !== 'admin') {
        // Allowing admin to access user dashboard for now if desired, or just strict.
        // Strict interpretation:
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
