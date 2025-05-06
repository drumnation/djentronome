import { createTheme, MantineColorsTuple } from '@mantine/core';

// DjentRed (metal) accent color
const djentRed: MantineColorsTuple = [
  '#ffebeb', // lightest
  '#ffc6c6',
  '#ff8e8e',
  '#ff5656',
  '#ff2d2d',
  '#e60000', // primary
  '#b30000',
  '#800000',
  '#4d0000',
  '#1a0000'  // darkest
];

// Dark theme colors
const dark: MantineColorsTuple = [
  '#f8f9fa',
  '#e9ecef',
  '#dee2e6',
  '#c6cad0',
  '#a1a7af',
  '#7e848c',
  '#636770',
  '#4a4e56',
  '#30333a',
  '#0d0d0d'  // background dark - updated to be near-black but not pure black
];

export const theme = createTheme({
  primaryColor: 'djentRed',
  colors: {
    djentRed,
    dark,
  },
  fontFamily: 'Rajdhani, Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  defaultRadius: 'md',
  black: '#0a0a0a',
  white: '#ffffff',
  breakpoints: {
    xs: '36em',    // 576px
    sm: '48em',    // 768px
    md: '62em',    // 992px
    lg: '75em',    // 1200px
    xl: '88em',    // 1408px
  },
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
  },
  other: {
    headerHeight: 70,     // Increased header height
    footerHeight: 40,
    sidebarWidth: 250,
    contentMaxWidth: 960, // Maximum content width
    // Color system
    backgroundColor: '#0d0d0d',
    sidebarBackground: '#111111',
    borderColor: '#2a2a2a',
    textPrimary: '#ffffff',
    textSecondary: '#a1a1a1',
    accentColor: '#e60000',
    // Fonts
    headingFamily: 'Orbitron, Rajdhani, sans-serif',
  },
});

export type AppTheme = typeof theme; 