import { ButtonProps as MantineButtonProps } from '@mantine/core';

export interface ButtonProps extends Omit<MantineButtonProps, 'classNames'> {
  /**
   * Optional custom variant beyond what Mantine provides
   */
  customVariant?: 'primary' | 'secondary' | 'tertiary';
  
  /**
   * Click handler
   */
  onClick?: () => void;
} 