import { Container } from '@src/components/layouts/Container';
import { AdminDashboardClient } from '@src/features/dashboard/dashboard.index';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Story Arc',
  description: 'Manage Story Arc platform activity and statistics.',
};

export default function AdminDashboardPage() {
  return (
    <Container className='p-6'>
      <AdminDashboardClient />
    </Container>
  );
}
