/** @jsxImportSource @emotion/react */
import { useMantineTheme, Box, Text } from '@mantine/core';
import { SidebarProps, NavItem } from './Sidebar.types';
import { createSidebarStyles } from './Sidebar.styles';

export const Sidebar = ({ isOpen, navItems, activePath }: SidebarProps) => {
  const theme = useMantineTheme();
  const styles = createSidebarStyles(theme, isOpen);

  // This is a more generic component that doesn't know about React Router
  // The component that uses this will need to provide the NavLink implementation
  const renderNavItem = (item: NavItem, index: number) => {
    const isActive = activePath === item.path;
    
    return (
      <a 
        key={index}
        href={item.path}
        css={styles.navItem}
        className={isActive ? 'active' : ''}
      >
        {item.icon && <span css={styles.navIcon}>{item.icon}</span>}
        <Text fw={isActive ? 500 : 400}>{item.label}</Text>
      </a>
    );
  };

  return (
    <Box component="nav" css={styles.sidebar}>
      {navItems.map(renderNavItem)}
    </Box>
  );
}; 