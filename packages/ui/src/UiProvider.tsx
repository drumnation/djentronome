import React from 'react';
import { ThemeProvider, defaultTheme } from './theme';

interface UiProviderProps {
  children: React.ReactNode;
}

export const UiProvider: React.FC<UiProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={defaultTheme}>
      {children}
    </ThemeProvider>
  );
}; 