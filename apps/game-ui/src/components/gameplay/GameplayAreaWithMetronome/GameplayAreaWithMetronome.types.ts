import { ReactNode } from 'react';

/**
 * Props for the GameplayAreaWithMetronome component
 */
export interface GameplayAreaWithMetronomeProps {
  /**
   * Width of the game area
   * @default window.innerWidth
   */
  width?: number;
  
  /**
   * Height of the game area
   * @default window.innerHeight * 0.8
   */
  height?: number;
  
  /**
   * Initial BPM for the metronome and game elements
   * @default 120
   */
  initialBpm?: number;
  
  /**
   * Initial beats per measure for the metronome
   * @default 4
   */
  initialBeatsPerMeasure?: number;
  
  /**
   * Initial subdivision setting (1 = quarter notes, 2 = eighth notes, etc.)
   * @default 1
   */
  initialSubdivision?: number;
  
  /**
   * Whether to use triplet feel initially
   * @default false
   */
  initialTripletFeel?: boolean;
  
  /**
   * Children to render inside the NoteHighwayCanvas
   */
  canvasChildren?: ReactNode;
  
  /**
   * Position of the metronome UI relative to the canvas
   * @default 'bottom'
   */
  metronomePosition?: 'bottom' | 'side';
  
  /**
   * Whether to hide the metronome UI
   * @default false
   */
  hideMetronome?: boolean;
  
  /**
   * Callback when BPM changes
   */
  onBpmChange?: (bpm: number) => void;
} 