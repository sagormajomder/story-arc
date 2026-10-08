import { API_BASE_URL } from '@src/config/api.config';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, message: 'No refresh token found' },
        { status: 401 }
      );
    }

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    const backendRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-requested-with': 'fetch',
        Origin: origin,
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      // Clear cookie if refresh token was invalid/revoked
      cookieStore.delete('refreshToken');
      cookieStore.delete('userRole');
      cookieStore.delete('authUser');

      return NextResponse.json(
        { success: false, message: data.message || 'Refresh failed' },
        { status: backendRes.status }
      );
    }

    // Check if rotated refreshToken cookie was returned
    const setCookieHeader = backendRes.headers.get('set-cookie');
    if (setCookieHeader) {
      const match = setCookieHeader.match(/refreshToken=([^;]+)/);
      if (match) {
        cookieStore.set('refreshToken', match[1], {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        });
      }
    }

    const userStr = cookieStore.get('authUser')?.value;
    let user = null;
    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch {
      user = null;
    }

    return NextResponse.json({
      ...data,
      data: {
        ...data?.data,
        user,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    console.error('Refresh proxy error:', error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
