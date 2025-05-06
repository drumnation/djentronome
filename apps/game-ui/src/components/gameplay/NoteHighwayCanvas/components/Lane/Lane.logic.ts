import { LaneType } from './Lane.types';

/**
 * Gets the color for a given drum lane
 */
export const getDrumLaneColor = (lane: number): string => {
  switch(lane) {
    case LaneType.CYMBAL: return '#3f3a20'; // Cymbal - dark gold
    case LaneType.SNARE: return '#3f2020'; // Snare - dark red
    case LaneType.LEFT_KICK: return '#20203f'; // Left kick - dark blue
    case LaneType.RIGHT_KICK: return '#203f20'; // Right kick - dark green
    default: return '#2f2f2f';
  }
};

/**
 * Gets the label text for a given drum lane
 */
export const getLaneLabel = (lane: number): string => {
  switch(lane) {
    case LaneType.CYMBAL: return 'CYMBAL';
    case LaneType.SNARE: return 'SNARE';
    case LaneType.LEFT_KICK: return 'L KICK';
    case LaneType.RIGHT_KICK: return 'R KICK';
    default: return '';
  }
}; 