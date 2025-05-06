/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { useMantineTheme, Box } from '@mantine/core';
import { LayoutProps } from './Layout.types';
import { createLayoutStyles } from './Layout.styles';
import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Footer } from '../Footer';

export const Layout = ({ children }: LayoutProps) => {
  const theme = useMantineTheme();
  const styles = createLayoutStyles(theme);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box css={styles.layout}>
      <Header onToggleSidebar={handleToggleSidebar} />
      
      <Box css={styles.main}>
        <Box css={styles.sidebar}>
          <Sidebar isOpen={true} />
        </Box>
        
        {/* Mobile sidebar */}
        <Sidebar isOpen={sidebarOpen} />
        
        <Box css={styles.content}>
          {children}
        </Box>
      </Box>
      
      <Footer />
    </Box>
  );
}; 