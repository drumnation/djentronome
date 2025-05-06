import { css } from '@emotion/react';
import { MantineTheme } from '@mantine/core';

export const createLayoutStyles = (theme: MantineTheme) => ({
  layout: css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 100%;
    min-height: 100vh;
    height: 100vh; /* Ensure it takes full viewport height */
    overflow: hidden; /* Prevent scrolling on the layout container */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${theme.other.backgroundColor};
    color: ${theme.other.textPrimary};
  `,
  main: css`
    display: flex;
    flex: 1;
    width: 100%;
    max-width: 100%;
    min-height: 0; /* Allow it to shrink if needed */
    overflow: hidden; /* Contain the overflow */
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: ${theme.other.backgroundColor};
  `,
  content: css`
    flex: 1;
    width: 100%;
    max-width: 100%;
    padding: ${theme.spacing.md};
    overflow-y: auto; /* Allow content area to scroll */
    box-sizing: border-box;
    
    /* Dark scrollbar styling */
    scrollbar-width: thin;
    scrollbar-color: ${theme.other.borderColor} ${theme.other.backgroundColor};
    
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: ${theme.other.backgroundColor};
    }
    
    &::-webkit-scrollbar-thumb {
      background-color: ${theme.other.borderColor};
      border-radius: 4px;
    }
  `,
  sidebar: css`
    display: none;
    width: ${theme.other.sidebarWidth}px; /* Fixed width for desktop sidebar */
    min-width: ${theme.other.sidebarWidth}px;
    flex-shrink: 0; /* Prevent sidebar from shrinking */
    box-sizing: border-box;
    
    @media (min-width: ${theme.breakpoints.md}) {
      display: block;
    }
  `,
  mobileSidebarContainer: css`
    position: fixed;
    top: ${theme.other.headerHeight}px;
    bottom: ${theme.other.footerHeight}px;
    left: 0;
    width: ${theme.other.sidebarWidth}px;
    z-index: 100;
    background-color: ${theme.other.sidebarBackground};
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.5);
    transition: transform 0.3s ease;
    box-sizing: border-box;
    
    /* Hide on desktop */
    @media (min-width: ${theme.breakpoints.md}) {
      display: none;
    }
  `,
  mobileSidebarHidden: css`
    transform: translateX(-100%);
  `,
  mobileSidebarVisible: css`
    transform: translateX(0);
  `,
}); 