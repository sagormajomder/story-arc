import Footer from '@/components/layouts/Footer';
import Header from '@/components/layouts/Header';

export default function layout({ children }) {
  return (
    <div className='grid grid-rows-[auto_1fr_auto] min-h-dvh'>
      <Header />
      <main className='min-w-0'>{children}</main>
      <Footer />
    </div>
  );
}
