import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import UserStats from '@/components/users/UserStats';
import UserTable from '@/components/users/UserTable';
import { IUser } from '@/types';
import { getServerSession } from 'next-auth';

interface IManageUsersSearchParams {
  page?: string;
}

interface IManageUsersPageProps {
  searchParams: Promise<IManageUsersSearchParams>;
}

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

async function getUsers(page: number = 1): Promise<IUsersResponse> {
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

export default async function ManageUsersPage({
  searchParams,
}: IManageUsersPageProps) {
  const { page } = await searchParams;
  const currentPage = page ? parseInt(page, 10) : 1;
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
