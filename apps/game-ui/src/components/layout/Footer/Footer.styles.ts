import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createFooterStyles = (theme: MantineTheme) => ({
  footer: css`
    height: ${theme.other.footerHeight}px;
    background-color: ${theme.colors.gray[1]};
    border-top: 1px solid ${theme.colors.gray[3]};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${theme.spacing.md};
    font-size: ${theme.fontSizes.xs};
    color: ${theme.colors.gray[7]};
  `,
  footerSection: css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing.sm};
  `,
}); 