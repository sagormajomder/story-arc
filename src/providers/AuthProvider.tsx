'use client';

import { authApi } from '@src/lib/auth-api';
import {
  broadcastLogout,
  refreshAccessToken,
  subscribeTokenChange,
} from '@src/lib/auth-token';
import type {
  AuthStatus,
  IAuthContext,
  ILoginPayload,
  IRegisterPayload,
  IUser,
} from '@src/types/auth.types';
import { useRouter } from 'next/navigation';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const AuthContext = createContext<IAuthContext | null>(null);

export interface IAuthProviderProps {
  children: React.ReactNode;
}

export function setClientAuthCookies(user: IUser, days = 7) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';

  document.cookie = `isLoggedIn=true; path=/; expires=${expires}; SameSite=Lax${secure}`;
  if (user.role) {
    document.cookie = `userRole=${encodeURIComponent(user.role)}; path=/; expires=${expires}; SameSite=Lax${secure}`;
  }
  document.cookie = `authUser=${encodeURIComponent(JSON.stringify(user))}; path=/; expires=${expires}; SameSite=Lax${secure}`;
}

export function clearClientAuthCookies() {
  if (typeof document === 'undefined') return;
  document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie = 'authUser=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax';
}

function getCachedUser(): IUser | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/authUser=([^;]+)/);
  if (match) {
    try {
      return JSON.parse(decodeURIComponent(match[1]));
    } catch {
      return null;
    }
  }
  return null;
}

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(() => getCachedUser());
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<AuthStatus>(() =>
    getCachedUser() ? 'authenticated' : 'loading'
  );
  const router = useRouter();

  // Validate session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const freshUser = await authApi.getMe();
        if (!isMounted) return;

        setUser(freshUser);
        setStatus('authenticated');
        setClientAuthCookies(freshUser);
      } catch {
        if (!isMounted) return;
        clearClientAuthCookies();
        setUser(null);
        setStatus('unauthenticated');

        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath.startsWith('/admin') || currentPath.startsWith('/user')) {
            router.push(`/login?callbackUrl=${encodeURIComponent(currentPath)}`);
          }
        }
      }
    }

    initSession();

    // Subscribe to cross-tab token synchronization & logout
    const unsubscribe = subscribeTokenChange(async (newToken) => {
      if (!isMounted) return;
      if (newToken) {
        try {
          const freshUser = await authApi.getMe();
          if (!isMounted) return;
          setUser(freshUser);
          setStatus('authenticated');
          setClientAuthCookies(freshUser);
        } catch {
          // ignore background sync errors
        }
      } else {
        clearClientAuthCookies();
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [router]);

  const login = useCallback(async (data: ILoginPayload) => {
    setStatus('loading');
    try {
      const res = await authApi.login(data);
      setUser(res.user);
      setStatus('authenticated');
      setClientAuthCookies(res.user);
      return res.user;
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const googleLogin = useCallback(
    async (tokenStr: string, type: 'access' | 'id' = 'access') => {
      setStatus('loading');
      try {
        const res = await authApi.googleLogin(tokenStr, type);
        setUser(res.user);
        setStatus('authenticated');
        setClientAuthCookies(res.user);
        return res.user;
      } catch (error) {
        setStatus('unauthenticated');
        throw error;
      }
    },
    []
  );

  const register = useCallback(async (data: IRegisterPayload) => {
    const res = await authApi.register(data);
    return { success: true, message: res.message };
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (e) {
      console.warn('Logout API failed:', e);
    }
    clearClientAuthCookies();
    broadcastLogout();
    setUser(null);
    setStatus('unauthenticated');
    router.push('/login');
  }, [router]);

  const refresh = useCallback(async () => {
    return await refreshAccessToken();
  }, []);

  const value = useMemo<IAuthContext>(
    () => ({
      user,
      token,
      status,
      isLoading: status === 'loading',
      isAuthenticated: status === 'authenticated' && !!user,
      login,
      register,
      googleLogin,
      logout,
      refresh,
    }),
    [user, token, status, login, register, googleLogin, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Backward compatibility hook matching NextAuth's useSession() interface.
 * Allows all existing components to work without breaking.
 */
export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    return { data: null, status: 'unauthenticated' as AuthStatus };
  }
  return {
    data: context.user ? { user: context.user, token: context.token } : null,
    status: context.status,
  };
}

/**
 * Backward compatibility function for signOut() calls.
 */
export function signOut({ callbackUrl }: { callbackUrl?: string } = {}) {
  clearClientAuthCookies();
  broadcastLogout();
  if (typeof window !== 'undefined') {
    authApi.logout().finally(() => {
      window.location.href = callbackUrl || '/login';
    });
  }
}
