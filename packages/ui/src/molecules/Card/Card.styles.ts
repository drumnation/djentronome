import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createCardStyles = (theme: MantineTheme) => ({
  card: css`
    background-color: ${theme.other.sidebarBackground || '#111111'};
    border-radius: ${theme.defaultRadius};
    border: 1px solid ${theme.other.borderColor || '#2a2a2a'};
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    overflow: hidden;
    transition: all 0.2s ease;
    
    &:hover {
      box-shadow: 0 0 12px rgba(128, 0, 0, 0.3);
      transform: translateY(-2px);
    }
  `,
  header: css`
    padding: ${theme.spacing.md};
    border-bottom: 1px solid ${theme.other.borderColor || '#2a2a2a'};
    font-family: ${theme.other.headingFamily || 'Orbitron, sans-serif'};
    font-weight: 600;
    color: ${theme.other.accentColor || '#e60000'};
    letter-spacing: 0.5px;
  `,
  content: css`
    padding: ${theme.spacing.md};
    font-family: ${theme.fontFamily};
  `,
  footer: css`
    padding: ${theme.spacing.md};
    border-top: 1px solid ${theme.other.borderColor || '#2a2a2a'};
    display: flex;
    justify-content: flex-end;
  `,
}); 