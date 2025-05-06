import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createHeaderStyles = (theme: MantineTheme) => ({
  header: css`
    height: ${theme.other.headerHeight}px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing.md};
    background-color: ${theme.colors[theme.primaryColor]?.[6] || theme.primaryColor};
    color: ${theme.white};
  `,
  logo: css`
    font-size: ${theme.fontSizes.xl};
    font-weight: 700;
    letter-spacing: 1px;
  `,
  navSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
  `,
}); 