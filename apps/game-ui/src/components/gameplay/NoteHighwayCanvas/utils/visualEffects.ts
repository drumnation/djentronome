/**
 * Helper functions for visual effects in the note highway
 */
import { easeOutCubic } from './easingFunctions';
import type { Material, MeshStandardMaterial } from 'three';

/**
 * Calculates opacity based on Z distance from a reference point (typically the hit line)
 * 
 * @param zPosition Current z position of the object
 * @param referenceZ Reference z position (typically the hit line at z=5)
 * @param fadeStartDistance Distance from reference where fading begins
 * @param fadeDistance How far the fade extends
 * @param minOpacity Minimum opacity value (won't fade below this)
 * @param easingFn Optional easing function for the fade curve
 * @returns Calculated opacity value between minOpacity and 1
 */
export const calculateZDepthOpacity = (
  zPosition: number,
  referenceZ: number = 5, 
  fadeStartDistance: number = 10,
  fadeDistance: number = 30,
  minOpacity: number = 0.3,
  easingFn: (t: number) => number = easeOutCubic
): number => {
  // Calculate distance from reference point
  const distanceFromReference = Math.abs(zPosition - referenceZ);
  
  // If within fadeStartDistance, return full opacity
  if (distanceFromReference <= fadeStartDistance) {
    return 1.0;
  }
  
  // Calculate how far into the fade zone we are (0-1)
  const fadeProgress = Math.min(
    (distanceFromReference - fadeStartDistance) / fadeDistance,
    1.0
  );
  
  // Apply easing function to get a smoother transition
  const easedFadeProgress = easingFn(fadeProgress);
  
  // Calculate final opacity, ensuring it doesn't go below minOpacity
  return 1.0 - (easedFadeProgress * (1.0 - minOpacity));
};

/**
 * Adjusts a color's brightness based on distance
 * 
 * @param baseColor Base color to adjust
 * @param brightness Brightness factor (0-1)
 * @returns Brightened hex color
 */
export const adjustColorBrightness = (
  baseColor: string,
  brightness: number
): string => {
  // Parse the hex color
  const hex = baseColor.replace('#', '');
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Adjust brightness
  r = Math.min(255, Math.floor(r + (255 - r) * brightness));
  g = Math.min(255, Math.floor(g + (255 - g) * brightness));
  b = Math.min(255, Math.floor(b + (255 - b) * brightness));
  
  // Convert back to hex
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Applies Z-depth fading to a material
 * Handles both opacity and color adjustment for better distance perception
 * 
 * @param material The material to modify
 * @param zPosition Current Z position
 * @param isLowLane Whether this is a bottom lane that needs extra visibility
 * @param laneColor Base color of the lane
 */
export const applyZDepthFading = (
  material: Material | Material[],
  zPosition: number,
  isLowLane: boolean = false,
  laneColor?: string
): void => {
  // Calculate the opacity
  const opacity = calculateZDepthOpacity(
    zPosition,
    5, // Reference Z (hit line)
    10, // Start fading at 10 units
    30, // Fade over 30 units
    isLowLane ? 0.4 : 0.3 // Higher min opacity for kicks
  );
  
  // Apply the calculated opacity
  const applyToMaterial = (mat: Material) => {
    if ('opacity' in mat) {
      mat.transparent = opacity < 0.99;
      mat.opacity = opacity;
      
      // For low lanes (kicks), boost color/saturation at distance
      if (isLowLane && laneColor && 'color' in mat && 'emissive' in mat) {
        // Boost brightness for distant kicks to maintain visibility
        if (opacity < 0.8) {
          // How much to boost (more boost as opacity decreases)
          const boostFactor = (1 - opacity) * 0.5; // 0 to 0.5
          const adjustedColor = adjustColorBrightness(laneColor, boostFactor);
          
          // Apply to both color and emissive for MeshStandardMaterial
          const stdMat = mat as MeshStandardMaterial;
          if (stdMat.color) {
            stdMat.color.set(adjustedColor);
          }
          if (stdMat.emissive) {
            stdMat.emissive.set(adjustedColor);
          }
          
          // Boost emissive intensity for distant kicks
          if ('emissiveIntensity' in mat) {
            stdMat.emissiveIntensity = 0.4 + boostFactor * 0.6;
          }
        }
      }
    }
  };
  
  // Apply to single material or array of materials
  if (Array.isArray(material)) {
    material.forEach(applyToMaterial);
  } else {
    applyToMaterial(material);
  }
};

/**
 * Gets a brightened lane color for kick drums at distance
 * 
 * @param lane Lane number (0-3)
 * @param isDistant Whether the note is distant and needs brightening
 * @param brightness Brightness boost (0-1)
 * @returns Appropriate color for the lane
 */
export const getLaneColor = (
  lane: number,
  isDistant: boolean = false,
  brightness: number = 0
): string => {
  let baseColor = '';
  
  switch(lane) {
    case 0: baseColor = '#ffdd00'; break; // Yellow for cymbal
    case 1: baseColor = '#ff4400'; break; // Red for snare
    case 2: baseColor = '#3366ff'; break; // Blue for left kick
    case 3: baseColor = '#00cc44'; break; // Green for right kick 
    default: baseColor = '#ffffff';
  }
  
  // For kicks at distance, use brighter versions
  if (isDistant && (lane === 2 || lane === 3)) {
    return adjustColorBrightness(baseColor, brightness);
  }
  
  return baseColor;
}; 