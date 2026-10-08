import { Toaster } from '@src/components/ui/sonner';
import { cn } from '@src/lib/utils';
import { AuthProvider, ThemeProvider } from '@src/providers';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const playfairDisplayHeading = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Story Arc - Map your reading journey',
  description:
    "Your reading history isn't just a list; it’s a narrative. The app visualizes your progress as an evolving 'arc' of genres, authors, and insights",
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={cn(
        'font-sans antialiased',
        inter.variable,
        playfairDisplayHeading.variable,
      )}>
      <body className='min-h-full bg-background text-foreground'>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
