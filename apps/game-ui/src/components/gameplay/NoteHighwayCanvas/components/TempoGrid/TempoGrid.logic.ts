import { Material } from 'three';
import { GridLinePosition } from './TempoGrid.types';

/**
 * Calculate the spacing between grid lines based on BPM
 */
export const calculateLineSpacing = (bpm: number): number => {
  // Speed is 5 units per second
  const notesPerSecond = 5;
  // Convert BPM to beats per second
  const beatsPerSecond = bpm / 60;
  // Return spacing between beat lines
  return notesPerSecond / beatsPerSecond;
};

/**
 * Generate positions for grid lines
 */
export const generateGridLinePositions = (
  lines: number,
  length: number,
  lineSpacing: number
): GridLinePosition[] => {
  const positions: GridLinePosition[] = [];
  const mainLineInterval = 4; // Every 4th line is a measure line (stronger)
  const subBeatInterval = 2; // Half-beat line (medium strength)
  
  for (let i = 0; i < lines; i++) {
    const z = -length + (i * lineSpacing) % length;
    positions.push({
      position: [0, 0.01, z] as [number, number, number],
      isMeasureLine: i % mainLineInterval === 0,
      isSubBeatLine: !((i % mainLineInterval === 0)) && (i % subBeatInterval === 0)
    });
  }
  
  return positions;
};

/**
 * Update the grid line position with scrolling
 */
export const updateGridLinePosition = (
  gridPos: GridLinePosition,
  scrollTime: number,
  length: number
): number => {
  const z = gridPos.position[2] + (scrollTime * 5) % length;
  // Wraparound when lines go past the hit line
  return z > 5 ? z - length : z;
};

/**
 * Calculate material opacity based on grid line type and distance to hit line
 */
export const calculateGridLineOpacity = (
  material: Material,
  distToHitLine: number,
  isMeasureLine: boolean,
  isSubBeatLine: boolean
): void => {
  if ('opacity' in material) {
    // Different opacity levels based on line importance
    const baseOpacity = isMeasureLine ? 0.7 : (isSubBeatLine ? 0.4 : 0.2);
    
    // Fade out as they approach hit zone
    material.opacity = Math.min(baseOpacity, baseOpacity * (1 - Math.max(0, 1 - distToHitLine / 2)));
  }
}; 