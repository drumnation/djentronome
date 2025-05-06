import { HitQuality, NoteDimensions } from './EnhancedNote.types';

// Visual constants
export const HIT_LINE_Z = 5;
export const VISIBILITY_NEAR = -80; // Furthest visible distance
export const VISIBILITY_FAR = 10;   // Closest visible distance (past hit point)
export const OPACITY_FULL_POINT = -5; // Where notes reach full opacity
export const MIN_OPACITY = 0.3;     // Notes never go fully transparent

export const NOTE_DIMENSIONS: NoteDimensions = {
  cymbal: { radius: 0.9, height: 0.12, segments: 32 },
  snare: { radius: 0.8, height: 0.3, segments: 6 },
  kick: { width: 0.8, height: 0.8, depth: 0.3 },
};

/**
 * Get note color based on hit quality and lane
 */
export const getNoteColor = (hit: boolean, lane: number, hitQuality: HitQuality): string => {
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
    case 2: return '#3366ff'; // Blue left kick - enhanced
    case 3: return '#00ff66'; // Bright green right kick - enhanced
    default: return '#ffffff';
  }
};

/**
 * Get emissive color for note glow
 */
export const getEmissiveColor = (hit: boolean, lane: number, hitQuality: HitQuality): string => {
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
    case 2: return '#0044dd'; // Blue left kick - enhanced
    case 3: return '#00cc33'; // Bright green right kick - enhanced
    default: return '#444444';
  }
};

/**
 * Get wireframe color based on hit quality and lane
 */
export const getWireframeColor = (hit: boolean, lane: number, hitQuality: HitQuality): string => {
  if (hit) {
    switch (hitQuality) {
      case 'perfect': return '#00ff99';
      case 'good': return '#ffcc00'; 
      case 'early': return '#ff9900';
      case 'late': return '#ff6600';
      default: return '#ffffff';
    }
  }
  
  return lane === 3 ? '#33ff88' : '#66aaff';
};

/**
 * Check if note is within visible range
 */
export const getVisibilityByDistance = (z: number): boolean => {
  return z > VISIBILITY_NEAR && z < VISIBILITY_FAR;
};

/**
 * Calculate opacity based on distance and lane
 */
export const getOpacityByDistance = (z: number, isKickDrum: boolean): number => {
  // Remapping function from one range to another
  const map = (value: number, inMin: number, inMax: number, outMin: number, outMax: number) => {
    return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
  };
  
  // Apply minimum opacity for kick drums to ensure visibility
  const minimumOpacity = isKickDrum ? 0.4 : MIN_OPACITY;
  
  // Clamping function to keep value in range
  const clamp = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(value, max));
  };
  
  // Calculate opacity as a function of distance
  if (z < VISIBILITY_NEAR || z > VISIBILITY_FAR) {
    return 0; // Outside visible range
  } else if (z < OPACITY_FULL_POINT) {
    // Fade in as note approaches from distance
    return clamp(map(z, VISIBILITY_NEAR, OPACITY_FULL_POINT, minimumOpacity, 1), minimumOpacity, 1);
  } else {
    // Full opacity near the hit line and fading after passing
    return clamp(map(z, OPACITY_FULL_POINT, VISIBILITY_FAR, 1, 0.5), 0.5, 1); 
  }
}; 