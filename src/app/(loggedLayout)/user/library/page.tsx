import Container from '@/components/layouts/Container';
import LibraryClient from '@/components/library/LibraryClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Library | Story Arc',
  description: 'Manage your reading shelves and track progress.',
};

export default function LibraryPage() {
  return (
    <div className='py-8 min-h-screen bg-background'>
      <Container>
        <LibraryClient />
      </Container>
    </div>
  );
}
