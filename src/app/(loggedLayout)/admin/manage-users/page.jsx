import UserStats from '@/components/users/UserStats';
import UserTable from '@/components/users/UserTable';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

async function getUsers(page = 1) {
  const session = await getServerSession(authOptions);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?page=${page}&limit=10`,
    {
      cache: 'no-store',
      headers: {
        Authorization: `Bearer ${session?.token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch users');
  }

  return res.json();
}

export default async function ManageUsersPage({ searchParams }) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page) : 1;
  const data = await getUsers(currentPage);

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
        activeUsers={data.stats.activeUsers}
        adminRoles={data.stats.adminRoles}
      />

      {/* Users Table */}
      <UserTable
        users={data.users}
        currentPage={data.currentPage}
        totalPages={data.totalPages}
        totalUsers={data.totalUsers}
      />
    </div>
  );
}
