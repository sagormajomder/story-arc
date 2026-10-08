'use client';

import { authApi } from '@src/lib/auth-api';
import {
  broadcastLogout,
  getMemoryToken,
  refreshAccessToken,
  setMemoryToken,
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

export function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(getMemoryToken());
  const [status, setStatus] = useState<AuthStatus>('loading');
  const router = useRouter();

  // Helper to extract cached authUser cookie
  const getCachedUser = useCallback((): IUser | null => {
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
  }, []);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        const freshToken = await refreshAccessToken();
        if (!isMounted) return;

        if (freshToken) {
          const cachedUser = getCachedUser();
          setToken(freshToken);
          setUser(cachedUser);
          setStatus('authenticated');
        } else {
          setToken(null);
          setUser(null);
          setStatus('unauthenticated');
        }
      } catch {
        if (!isMounted) return;
        setToken(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    }

    initSession();

    // Subscribe to cross-tab token synchronization & logout
    const unsubscribe = subscribeTokenChange((newToken) => {
      if (!isMounted) return;
      if (newToken) {
        setToken(newToken);
        const cached = getCachedUser();
        if (cached) setUser(cached);
        setStatus('authenticated');
      } else {
        setToken(null);
        setUser(null);
        setStatus('unauthenticated');
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [getCachedUser]);

  const login = useCallback(async (data: ILoginPayload) => {
    setStatus('loading');
    try {
      const res = await authApi.login(data);
      setMemoryToken(res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

  const googleLogin = useCallback(async (idToken: string) => {
    setStatus('loading');
    try {
      const res = await authApi.googleLogin(idToken);
      setMemoryToken(res.accessToken);
      setToken(res.accessToken);
      setUser(res.user);
      setStatus('authenticated');
    } catch (error) {
      setStatus('unauthenticated');
      throw error;
    }
  }, []);

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
    broadcastLogout();
    setMemoryToken(null);
    setToken(null);
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
  broadcastLogout();
  setMemoryToken(null);
  if (typeof window !== 'undefined') {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      window.location.href = callbackUrl || '/login';
    });
  }
}
