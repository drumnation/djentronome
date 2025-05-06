/**
 * Props for the Lane component
 */
export interface LaneProps {
  position: [number, number, number];
  width: number;
  length: number;
  lane: number;
}

/**
 * Lane type identifiers
 */
export enum LaneType {
  CYMBAL = 0,
  SNARE = 1,
  LEFT_KICK = 2,
  RIGHT_KICK = 3
} 