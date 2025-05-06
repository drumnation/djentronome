import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createLayoutStyles = (theme: MantineTheme) => ({
  layout: css`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  `,
  main: css`
    display: flex;
    flex: 1;
  `,
  content: css`
    flex: 1;
    padding: ${theme.spacing.md};
    overflow-y: auto;
  `,
  sidebar: css`
    display: none;
    
    @media (min-width: ${theme.breakpoints.md}) {
      display: block;
    }
  `,
}); 