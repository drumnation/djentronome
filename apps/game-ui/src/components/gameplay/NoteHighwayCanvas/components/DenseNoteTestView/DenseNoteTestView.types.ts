/**
 * Props for the DenseNoteTestView component
 */
export interface DenseNoteTestViewProps {
  /**
   * Tempo in beats per minute
   */
  bpm?: number;
  
  /**
   * Whether the test view is enabled
   */
  enabled?: boolean;
}

export type TestMode = 'rapid-fire' | 'blast-beat' | 'polyrhythm' | 'dense-breakdown'; 