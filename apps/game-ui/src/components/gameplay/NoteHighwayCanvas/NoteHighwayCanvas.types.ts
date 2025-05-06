import { ReactNode } from 'react';

/**
 * Props for the NoteHighwayCanvas component
 */
export interface NoteHighwayCanvasProps {
  /**
   * Width of the canvas in pixels
   * @default window.innerWidth
   */
  width?: number;
  
  /**
   * Height of the canvas in pixels
   * @default window.innerHeight * 0.8
   */
  height?: number;
  
  /**
   * Child components to render inside the canvas (notes, lanes, etc.)
   */
  children?: ReactNode;
} 