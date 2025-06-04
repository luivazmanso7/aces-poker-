'use client';

import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { pokerTheme } from '@/theme/poker-theme';

interface ClientThemeProviderProps {
  children: React.ReactNode;
}

export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {
  return (
    <ThemeProvider theme={pokerTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
