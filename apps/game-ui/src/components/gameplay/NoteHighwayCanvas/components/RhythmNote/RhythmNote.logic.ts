import { WireframePoint } from './RhythmNote.types';

/**
 * Calculate Z length (depth) based on BPM to prevent overlap at high tempos
 */
export const calculateZLength = (bpm: number): number => {
  // More aggressive dynamic scaling based on BPM
  if (bpm <= 120) {
    return 0.4; // Base size for slower tempos
  } else if (bpm <= 180) {
    // Linear interpolation between 120 and 180 BPM
    const t = (bpm - 120) / 60;
    return 0.4 - (t * 0.25); // Scale from 0.4 down to 0.15
  } else {
    // For very fast tempos (180+ BPM)
    const t = Math.min((bpm - 180) / 60, 1);
    return 0.15 - (t * 0.07); // Scale from 0.15 down to 0.08 at 240+ BPM
  }
};

/**
 * Get base note color based on lane and hit state
 */
export const getNoteColor = (
  hit: boolean,
  lane: number,
  hitQuality: 'perfect' | 'good' | 'early' | 'late' | 'miss' | null
): string => {
  if (hit) {
    // Hit color based on quality
    switch (hitQuality) {
      case 'perfect': return '#00ff99';
      case 'good': return '#ffcc00';
      case 'early': return '#ff9900';
      case 'late': return '#ff6600';
      default: return '#ffffff';
    }
  }
  
  switch (lane) {
    case 0: return '#ffdd00'; // Yellow cymbal
    case 1: return '#ff4400'; // Red snare
    case 2: return '#3366ff'; // Blue left kick
    case 3: return '#00ff66'; // Bright green right kick
    default: return '#ffffff';
  }
};

/**
 * Get emissive color (glow) based on lane and hit state
 */
export const getEmissiveColor = (
  hit: boolean,
  lane: number,
  hitQuality: 'perfect' | 'good' | 'early' | 'late' | 'miss' | null
): string => {
  if (hit) {
    // Hit emissive based on quality
    switch (hitQuality) {
      case 'perfect': return '#00ff99';
      case 'good': return '#ffcc00';
      case 'early': return '#ff9900';
      case 'late': return '#ff6600';
      default: return '#ffffff';
    }
  }
  
  switch (lane) {
    case 0: return '#aa8800'; // Yellow cymbal
    case 1: return '#aa2200'; // Red snare
    case 2: return '#0044dd'; // Blue left kick
    case 3: return '#00cc33'; // Bright green right kick
    default: return '#444444';
  }
};

/**
 * Create wireframe points for kick drum outlines
 */
export const createWireframePoints = (zLength: number): WireframePoint[] => {
  const halfZ = zLength / 2;
  const size = 0.41; // Slightly larger than half the geometry size
  
  // Define the points as an array of [x,y,z] tuples
  return [
    [-size, -size, -halfZ], 
    [size, -size, -halfZ], 
    [size, size, -halfZ], 
    [-size, size, -halfZ], 
    [-size, -size, -halfZ],
    
    [-size, -size, halfZ], 
    [size, -size, halfZ], 
    [size, size, halfZ], 
    [-size, size, halfZ], 
    [-size, -size, halfZ],
    
    // Connect front to back
    [-size, -size, -halfZ], 
    [-size, -size, halfZ],
    
    // Reset position to draw remaining connections
    [size, -size, -halfZ], 
    [size, -size, halfZ],
    
    // Reset position again
    [size, size, -halfZ], 
    [size, size, halfZ],
    
    // Final connection
    [-size, size, -halfZ], 
    [-size, size, halfZ]
  ];
}; 