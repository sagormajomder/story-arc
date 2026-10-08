import { API_BASE_URL } from '@src/config/api.config';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const origin = req.headers.get('origin') || 'http://localhost:3000';

    if (refreshToken) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-requested-with': 'fetch',
            Origin: origin,
            Cookie: `refreshToken=${refreshToken}`,
          },
        });
      } catch (err) {
        console.warn('Backend logout call failed, clearing local cookie:', err);
      }
    }

    cookieStore.delete('refreshToken');
    cookieStore.delete('userRole');
    cookieStore.delete('authUser');

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Logout failed';
    console.error('Logout proxy error:', error);
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
