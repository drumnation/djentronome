import React from 'react';
import { ThemeProvider as EmotionThemeProvider } from '@emotion/react';

// Define our theme type
export interface UITheme {
  colors: {
    primary: string;
    secondary: string;
    tertiary?: string;
    background: string;
    backgroundLight?: string;
    text: string;
    textSecondary: string;
    error: string;
    success?: string;
    warning?: string;
    info?: string;
    border?: string;
    disabled?: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  borderRadius: {
    small: string;
    medium: string;
    large: string;
    round: string;
  };
  shadows: {
    small: string;
    medium: string;
    large: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      small: string;
      medium: string;
      large: string;
    };
    fontWeight: {
      regular: number;
      medium: number;
      bold: number;
    };
  };
}

// Default theme
export const defaultTheme: UITheme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#ffffff',
    backgroundLight: '#f8f9fa',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    error: '#e74c3c',
    success: '#2ecc71',
    warning: '#f39c12',
    info: '#3498db',
    border: '#dcdde1',
    disabled: '#bdc3c7',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '16px',
    round: '50%',
  },
  shadows: {
    small: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.12)',
    large: '0 10px 20px rgba(0, 0, 0, 0.15), 0 3px 6px rgba(0, 0, 0, 0.1)',
  },
  typography: {
    fontFamily: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
};

// Declare module augmentation for Emotion theme
declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}

interface ThemeProviderProps {
  theme?: UITheme;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  theme = defaultTheme,
  children
}) => {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
}; 