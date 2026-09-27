'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export interface IThemeProviderProps extends React.ComponentProps<typeof NextThemesProvider> {}

export default function ThemeProvider({ children, ...props }: IThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
