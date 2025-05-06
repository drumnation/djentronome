import type { Mesh } from 'three';
import { NoteProps } from '../../NoteHighwayCanvas.types';

/**
 * Props for the drum note rendering components
 */
export interface DrumNoteRenderProps {
  lane: number;
  zLength: number;
  pulseFactor: number;
  visualEmphasis: number;
  noteColor: string;
  isCloseToHitLine: boolean;
  isDistant: boolean;
  hit: boolean;
}

/**
 * Props for the note shadow component
 */
export interface NoteShadowProps {
  position: [number, number, number];
  lane: number;
  shadowOpacity: number;
}

/**
 * Props for the note trail component
 */
export interface NoteTrailProps {
  position: [number, number, number];
  lane: number;
  trailLength: number;
  trailColor: string;
}

/**
 * Internal refs used within the Note component
 */
export interface NoteRefs {
  meshRef: React.RefObject<Mesh>;
  hitTimeRef: React.RefObject<number | null>;
  timeRef: React.RefObject<number>;
}

export type { NoteProps }; 