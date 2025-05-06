import { ReactNode } from 'react';

export interface CardProps {
  /** Card title */
  title?: string;
  /** Card content */
  children: ReactNode;
  /** Optional footer content */
  footer?: ReactNode;
  /** Optional action button text */
  actionText?: string;
  /** Optional action button handler */
  onAction?: () => void;
} 