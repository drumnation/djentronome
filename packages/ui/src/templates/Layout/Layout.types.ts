import { ReactNode } from 'react';
import { NavItem } from '../../organisms/Sidebar/Sidebar.types';

export interface LayoutProps {
  children: ReactNode;
  navItems: NavItem[];
  version?: string;
  companyName?: string;
  activePath?: string;
  onToggleSidebar?: () => void;
} 