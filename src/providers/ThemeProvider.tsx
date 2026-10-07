'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';

export type IThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({
  children,
  ...props
}: IThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
