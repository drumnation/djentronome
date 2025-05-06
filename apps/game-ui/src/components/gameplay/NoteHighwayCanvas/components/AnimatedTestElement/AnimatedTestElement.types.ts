import { Mesh } from 'three';
import { ReactNode, RefObject, MutableRefObject } from 'react';

export interface AnimatedTestElementProps {
  children?: ReactNode; // Adding a prop to avoid empty interface warning
}

export interface NoteState {
  time: number;
  lastHit: number | null;
  missedInput: number | null;
}

export interface NoteRefs {
  yellowNoteRef: RefObject<Mesh | null>;
  redNoteRef: RefObject<Mesh | null>;
  blueNoteRef: RefObject<Mesh | null>;
  greenNoteRef: RefObject<Mesh | null>;
  highwayRef: RefObject<Mesh | null>;
  hitLineRef: RefObject<Mesh | null>;
  hitRingRefs: MutableRefObject<Mesh[]>;
}

export interface FontProps {
  letterSpacing: number;
  lineHeight: number;
  fontWeight: number;
  'material-toneMapped': boolean;
}

export interface LaneInfo {
  x: number;
  color: string;
  name: string;
  key: string;
}

export type KeyMap = Record<string, number>; 