import type { NoteProps } from '../../NoteHighwayCanvas.types';

// Hit quality types
export type HitQuality = 'perfect' | 'good' | 'early' | 'late' | 'miss' | null;

// Enhanced note props extending the base NoteProps
export interface EnhancedNoteProps extends NoteProps {
  showWireframe?: boolean; // Whether to show wireframe (default: auto for kicks)
  isAccent?: boolean;     // Whether this is an accented note
  hitQuality?: HitQuality; // Quality of hit timing (if applicable)
  isIntense?: boolean;    // Visual emphasis for intense sections
}

// Note dimension definitions
export interface NoteDimensions {
  cymbal: {
    radius: number;
    height: number;
    segments: number;
  };
  snare: {
    radius: number;
    height: number;
    segments: number;
  };
  kick: {
    width: number;
    height: number;
    depth: number;
  };
} 