import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createHeaderStyles = (theme: MantineTheme) => ({
  header: css`
    width: 100%; /* Full width */
    height: ${theme.other.headerHeight}px;
    max-height: ${theme.other.headerHeight}px; /* Add max height lock */
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.spacing.md} ${theme.spacing.lg}; /* Increased padding */
    background: linear-gradient(90deg, #0a0a0a 0%, #800000 100%);
    color: ${theme.white};
    box-sizing: border-box;
    overflow: hidden; /* Prevent overflow */
  `,
  logo: css`
    font-family: ${theme.other.headingFamily};
    font-size: ${theme.fontSizes.xl};
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    text-shadow: 0 0 10px rgba(230, 0, 0, 0.5);
  `,
  navSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.xs}; /* Control spacing between action icons */
  `,
}); 