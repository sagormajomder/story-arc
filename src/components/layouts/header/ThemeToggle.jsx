'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='w-9 h-9' />; // Placeholder to avoid layout shift
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className='p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors'
      aria-label='Toggle theme'>
      {theme === 'dark' ? (
        <Sun className='w-5 h-5 text-yellow-500' />
      ) : (
        <Moon className='w-5 h-5 text-gray-700' />
      )}
    </button>
  );
}
