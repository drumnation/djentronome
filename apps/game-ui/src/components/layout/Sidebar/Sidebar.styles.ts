import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createSidebarStyles = (theme: MantineTheme, isOpen: boolean) => ({
  sidebar: css`
    width: ${theme.other.sidebarWidth}px;
    height: calc(100vh - ${theme.other.headerHeight}px);
    background-color: ${theme.colors.gray[0]};
    border-right: 1px solid ${theme.colors.gray[3]};
    transition: transform 0.3s ease;
    
    @media (max-width: ${theme.breakpoints.md}) {
      position: fixed;
      top: ${theme.other.headerHeight}px;
      left: 0;
      z-index: 100;
      transform: translateX(${isOpen ? '0' : '-100%'});
    }
  `,
  navItem: css`
    display: flex;
    align-items: center;
    padding: ${theme.spacing.md};
    color: ${theme.colors.gray[7]};
    text-decoration: none;
    transition: background-color 0.2s ease;
    
    &:hover {
      background-color: ${theme.colors.gray[1]};
    }
    
    &.active {
      background-color: ${theme.colors[theme.primaryColor]?.[0] || theme.colors.gray[0]};
      color: ${theme.colors[theme.primaryColor]?.[7] || theme.colors.gray[7]};
      font-weight: 500;
    }
  `,
  navIcon: css`
    margin-right: ${theme.spacing.sm};
  `,
}); 