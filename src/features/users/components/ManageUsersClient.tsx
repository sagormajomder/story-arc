'use client';

import { UserStats } from './UserStats';
import { UserTable } from './UserTable';
import { usersApi } from '../api/users.api';
import type { IUser } from '../types/user.types';
import { useAuth } from '@src/providers';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface IUsersResponse {
  users: IUser[];
  stats: {
    activeUsers: number;
    adminRoles: number;
  };
  currentPage: number;
  totalPages: number;
  totalUsers: number;
}

export function ManageUsersClient() {
  const { token, isLoading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const [data, setData] = useState<IUsersResponse>({
    users: [],
    stats: { activeUsers: 0, adminRoles: 0 },
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      if (authLoading) return;
      setLoading(true);
      try {
        const res = (await usersApi.getUsers(
          currentPage,
          10,
          token || undefined
        )) as unknown as IUsersResponse;

        if (!isMounted) return;
        setData(res || { users: [], stats: { activeUsers: 0, adminRoles: 0 }, currentPage: 1, totalPages: 1, totalUsers: 0 });
      } catch (err) {
        console.error('Failed to load users:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, [currentPage, token, authLoading]);

  if (loading || authLoading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Loader2 className='w-8 h-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='p-8 max-w-7xl mx-auto space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-serif font-bold text-foreground'>
          Manage Users
        </h1>
        <p className='text-muted-foreground mt-1'>
          Manage roles for all registered readers.
        </p>
      </div>

      {/* Stats Cards */}
      <UserStats
        activeUsers={data.stats?.activeUsers}
        adminRoles={data.stats?.adminRoles}
      />

      {/* Users Table */}
      <UserTable
        users={data.users || []}
        currentPage={data.currentPage || 1}
        totalPages={data.totalPages || 1}
        totalUsers={data.totalUsers || 0}
      />
    </div>
  );
}
