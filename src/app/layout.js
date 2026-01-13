import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
});

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Story Arc - Map your reading journey',
  description:
    "Your reading history isn't just a list; it’s a narrative. The app visualizes your progress as an evolving 'arc' of genres, authors, and insights",
};

import AuthProvider from '@/components/auth/AuthProvider';

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground font-sans`}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster position='top-center' reverseOrder={false} />
      </body>
    </html>
  );
}
