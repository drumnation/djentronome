export interface SidebarProps {
  isOpen: boolean;
  navItems: NavItem[];
  activePath?: string; // Current active path for highlighting the active menu item
}

export type NavItem = {
  path: string;
  label: string;
  icon?: string; // Replace with actual icon component type if needed
}; 