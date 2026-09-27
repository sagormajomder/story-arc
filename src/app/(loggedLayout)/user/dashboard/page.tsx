import DashboardClient from '@/components/dashboard/DashboardClient';
import Container from '@/components/layouts/Container';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard | Story Arc',
  description: 'Your personalized reading dashboard.',
};

export default function DashboardPage() {
  return (
    <div className='py-8 min-h-screen bg-background'>
      <Container>
        <DashboardClient />
      </Container>
    </div>
  );
}
