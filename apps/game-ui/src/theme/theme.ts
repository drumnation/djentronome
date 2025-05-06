import { createTheme, MantineColorsTuple } from '@mantine/core';

const primaryColor: MantineColorsTuple = [
  '#ebf8ff',
  '#d3ecff',
  '#a8d2ff',
  '#7ab8ff',
  '#56a0ff',
  '#3d92ff',
  '#2b88ff',
  '#187bff',
  '#006eff',
  '#0061ff'
];

const secondaryColor: MantineColorsTuple = [
  '#f0f2ff',
  '#dcdeff',
  '#b9c0ff',
  '#929fff',
  '#6d7fff',
  '#5569ff',
  '#465dff',
  '#304fff',
  '#233eff',
  '#0022ff'
];

export const theme = createTheme({
  primaryColor: 'primary',
  colors: {
    primary: primaryColor,
    secondary: secondaryColor,
  },
  fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
  defaultRadius: 'md',
  breakpoints: {
    xs: '36em',    // 576px
    sm: '48em',    // 768px
    md: '62em',    // 992px
    lg: '75em',    // 1200px
    xl: '88em',    // 1408px
  },
  other: {
    headerHeight: 60,
    footerHeight: 40,
    sidebarWidth: 250,
  },
});

export type AppTheme = typeof theme; 