import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createFooterStyles = (theme: MantineTheme) => ({
  footer: css`
    width: 100%; /* Full width */
    height: ${theme.other.footerHeight}px;
    background-color: ${theme.other.sidebarBackground};
    border-top: 1px solid ${theme.other.borderColor};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing.lg}; /* Increased horizontal padding */
    font-size: ${theme.fontSizes.xs};
    color: ${theme.other.textSecondary};
    flex-shrink: 0; /* Prevent footer from shrinking */
    z-index: 10; /* Ensure footer is above other content */
    box-sizing: border-box;
  `,
  footerSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
  `,
}); 