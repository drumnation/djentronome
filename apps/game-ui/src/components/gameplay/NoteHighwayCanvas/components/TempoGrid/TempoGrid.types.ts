import { Group, Mesh } from 'three';

/**
 * Props for the TempoGrid component
 */
export interface TempoGridProps {
  /**
   * Beats per minute
   */
  bpm: number;
  
  /**
   * Number of grid lines to show
   */
  lines?: number;
  
  /**
   * Width of the grid
   */
  width?: number;
  
  /**
   * Length of the grid (z-axis)
   */
  length?: number;
  
  /**
   * Grid line color
   */
  color?: string;
}

/**
 * Represents a single grid line position and properties
 */
export interface GridLinePosition {
  position: [number, number, number];
  isMeasureLine: boolean;
  isSubBeatLine: boolean;
}

/**
 * Refs used in the TempoGrid component
 */
export interface TempoGridRefs {
  groupRef: React.RefObject<Group>;
  gridLinesRef: React.RefObject<(Mesh | null)[]>;
  scrollTimeRef: React.RefObject<number>;
} 