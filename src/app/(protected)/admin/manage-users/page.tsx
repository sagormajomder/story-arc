import { authOptions } from '@src/app/api/auth/[...nextauth]/route';
import { usersApi, UserStats, UserTable } from '@src/features/users';
import { IUser } from '@src/types';
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
  return (await usersApi.getUsers(page, 10, session?.token)) as unknown as IUsersResponse;
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
