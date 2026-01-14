import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import GenreChart from '@/components/admin/dashboard/GenreChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageSquareWarning, Users } from 'lucide-react';
import { getServerSession } from 'next-auth';

async function getDashboardData(token) {
  try {
    const statsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/stats`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );
    const chartsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/dashboard/charts`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );

    const stats = statsRes.ok ? await statsRes.json() : {};
    const charts = chartsRes.ok ? await chartsRes.json() : {};

    return {
      stats: stats,
      genreData: charts.genreData || [],
    };
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    return { stats: {}, genreData: [] };
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  const { stats, genreData } = await getDashboardData(session?.token);

  return (
    <div className='container mx-auto p-6 space-y-8'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold font-serif text-foreground mb-2'>
          Dashboard Overview
        </h1>
        <p className='text-muted-foreground'>
          Welcome back, Admin. Here&apos;s a summary of the latest platform
          activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {/* Total Books */}
        <Card className='bg-primary/5 border-none shadow-none text-card-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Books</CardTitle>
            <div className='h-8 w-8 rounded bg-green-500/10 flex items-center justify-center'>
              <BookOpen className='h-4 w-4 text-green-500' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalBooks || 0}</div>
          </CardContent>
        </Card>

        {/* Total Users */}
        <Card className='bg-primary/5 border-none shadow-none text-card-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Users</CardTitle>
            <div className='h-8 w-8 rounded bg-green-500/10 flex items-center justify-center'>
              <Users className='h-4 w-4 text-green-500' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalUsers || 0}</div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card className='bg-primary/5 border-none shadow-none text-card-foreground'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Reviews
            </CardTitle>
            <div className='h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center'>
              <MessageSquareWarning className='h-4 w-4 text-orange-500' />
            </div>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {stats.pendingReviews || 0}
            </div>
            {(stats.pendingReviews || 0) > 0 && (
              <p className='text-xs text-orange-500 mt-1 font-medium'>
                Action Required
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className='grid gap-4 md:grid-cols-1'>
        <Card className='col-span-1 bg-card border-border'>
          <CardHeader>
            <CardTitle>Books per Genre</CardTitle>
          </CardHeader>
          <CardContent className='pl-2'>
            {genreData.length > 0 ? (
              <GenreChart data={genreData} />
            ) : (
              <div className='h-[350px] flex items-center justify-center text-muted-foreground'>
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
