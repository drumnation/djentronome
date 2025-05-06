import type { Material } from 'three';
import type { NoteProps } from '../../NoteHighwayCanvas.types';

/**
 * Props for the RhythmNote component
 */
export interface RhythmNoteProps extends NoteProps {
  /**
   * Quality of the hit judgment when a note is hit
   */
  hitQuality?: 'perfect' | 'good' | 'early' | 'late' | 'miss' | null;
}

/**
 * Visual constants - explicit boundaries instead of gradual fading
 */
export const VISIBILITY_BOUNDS = {
  NEAR: -80, // Furthest visible point
  FAR: 10,   // After hit point, where notes disappear
  HIT_LINE: 5 // Z-position of the hit judgment line
};

/**
 * Extended Material type with properties we need to modify
 */
export type ExtendedMaterial = Material & {
  opacity?: number;
  transparent?: boolean;
  emissiveIntensity?: number;
};

/**
 * Wireframe point type for Three.js Line component
 */
export type WireframePoint = [number, number, number]; 