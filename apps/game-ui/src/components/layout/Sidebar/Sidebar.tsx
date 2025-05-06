/** @jsxImportSource @emotion/react */
import { NavLink as RouterNavLink } from 'react-router-dom';
import { useMantineTheme, Box, Text } from '@mantine/core';
import { SidebarProps } from './Sidebar.types';
import { createSidebarStyles } from './Sidebar.styles';
import { routes } from '../../../routes';

// Navigation item type
export type NavItem = {
  path: string;
  label: string;
  icon?: string; // Replace with actual icon component type if needed
};

// Navigation items using the routes object
const navItems: NavItem[] = [
  { path: routes.home, label: 'Home' },
  { path: routes.game, label: 'Play' },
  { path: routes.songSelection, label: 'Songs' },
  { path: routes.settings, label: 'Settings' },
  { path: routes.results, label: 'Results' },
];

export const Sidebar = ({ isOpen }: SidebarProps) => {
  const theme = useMantineTheme();
  const styles = createSidebarStyles(theme, isOpen);

  return (
    <Box component="nav" css={styles.sidebar}>
      {navItems.map((item) => (
        <RouterNavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => (isActive ? 'active' : '')}
          css={styles.navItem}
        >
          {item.icon && <span css={styles.navIcon}>{item.icon}</span>}
          <Text>{item.label}</Text>
        </RouterNavLink>
      ))}
    </Box>
  );
}; 