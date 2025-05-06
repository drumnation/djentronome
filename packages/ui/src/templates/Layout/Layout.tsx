/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useMantineTheme, Box } from '@mantine/core';
import { css } from '@emotion/react';
import { LayoutProps } from './Layout.types';
import { createLayoutStyles } from './Layout.styles';
import { Header } from '../../organisms/Header';
import { Sidebar } from '../../organisms/Sidebar';
import { Footer } from '../../organisms/Footer';

export const Layout = ({ 
  children, 
  navItems,
  version,
  companyName,
  activePath = '/',
  onToggleSidebar: externalToggle 
}: LayoutProps) => {
  const theme = useMantineTheme();
  const styles = createLayoutStyles(theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Call external toggle handler if provided
    if (externalToggle) {
      externalToggle();
    }
  };

  return (
    <Box css={styles.layout}>
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <Box css={styles.main}>
        {/* Desktop sidebar - only visible on larger screens */}
        <Box css={styles.sidebar}>
          <Sidebar isOpen={true} navItems={navItems} activePath={activePath} />
        </Box>
        
        {/* Mobile sidebar - only visible when toggled on smaller screens */}
        <Box 
          css={[
            styles.mobileSidebarContainer,
            sidebarOpen ? styles.mobileSidebarVisible : styles.mobileSidebarHidden
          ]}
        >
          <Sidebar isOpen={true} navItems={navItems} activePath={activePath} />
        </Box>
        
        <Box css={styles.content}>
          {children}
        </Box>
      </Box>
      
      <Footer version={version} companyName={companyName} />
    </Box>
  );
}; 