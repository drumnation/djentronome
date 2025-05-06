import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createSidebarStyles = (theme: MantineTheme, isOpen: boolean) => ({
  sidebar: css`
    width: ${theme.other.sidebarWidth}px;
    height: calc(100vh - ${theme.other.headerHeight}px);
    background-color: ${theme.other.sidebarBackground};
    border-right: 1px solid ${theme.other.borderColor};
    transition: transform 0.3s ease;
    padding-top: ${theme.spacing.sm};
    
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
    padding: ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.md} ${theme.spacing.lg};
    color: ${theme.other.textPrimary};
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    font-family: ${theme.fontFamily};
    letter-spacing: 0.5px;
    
    &:hover {
      background-color: #1a1a1a;
      color: ${theme.other.accentColor};
      text-shadow: 0 0 8px rgba(230, 0, 0, 0.3);
    }
    
    &.active {
      background-color: #151515;
      color: ${theme.other.accentColor};
      font-weight: 500;
      
      &:before {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        width: 2px;
        background-color: ${theme.other.accentColor};
        box-shadow: 0 0 8px 0 ${theme.other.accentColor};
      }
    }
  `,
  navIcon: css`
    margin-right: ${theme.spacing.sm};
  `,
}); 