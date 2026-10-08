import { API_BASE_URL } from '@src/config/api.config';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const backendRes = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: origin,
      },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        { success: false, message: data.message || 'Google login failed' },
        { status: backendRes.status }
      );
    }

    const setCookieHeader = backendRes.headers.get('set-cookie');
    let refreshTokenVal = '';

    if (setCookieHeader) {
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      if (match) {
        refreshTokenVal = match[1];
      }
    }

    const cookieStore = await cookies();

    if (refreshTokenVal) {
      cookieStore.set('refreshToken', refreshTokenVal, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });
    }

    if (data?.data?.user) {
      cookieStore.set('authUser', JSON.stringify(data.data.user), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      if (data.data.user.role) {
        cookieStore.set('userRole', data.data.user.role, {
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Google login proxy error:', error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
