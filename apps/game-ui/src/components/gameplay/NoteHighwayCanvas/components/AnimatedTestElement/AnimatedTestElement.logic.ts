import { Mesh, Material } from 'three';
import { RefObject, MutableRefObject } from 'react';
import { KeyMap, LaneInfo } from './AnimatedTestElement.types';

// Lane configuration
export const LANES: LaneInfo[] = [
  { x: -3, color: '#ffcc00', name: 'CYMBAL', key: 'd' },
  { x: -1, color: '#ff4400', name: 'SNARE', key: 'f' },
  { x: 1, color: '#0044ff', name: 'L KICK', key: 'j' },
  { x: 3, color: '#00cc44', name: 'R KICK', key: 'k' }
];

// Key mapping configuration
export const createKeyMap = (): KeyMap => {
  const keyMap: KeyMap = {};
  LANES.forEach((lane, index) => {
    keyMap[lane.key] = index;
  });
  return keyMap;
};

// Check if a note is in the hit zone
export const isNoteInHitZone = (
  lane: number,
  yellowNoteRef: RefObject<Mesh | null>,
  redNoteRef: RefObject<Mesh | null>,
  blueNoteRef: RefObject<Mesh | null>,
  greenNoteRef: RefObject<Mesh | null>
): boolean => {
  if (lane === 0 && yellowNoteRef.current) {
    return yellowNoteRef.current.position.z >= 4.5 && yellowNoteRef.current.position.z <= 5.5;
  } else if (lane === 1 && redNoteRef.current) {
    return redNoteRef.current.position.z >= 4.5 && redNoteRef.current.position.z <= 5.5;
  } else if (lane === 2 && blueNoteRef.current) {
    return blueNoteRef.current.position.z >= 4.5 && blueNoteRef.current.position.z <= 5.5;
  } else if (lane === 3 && greenNoteRef.current) {
    return greenNoteRef.current.position.z >= 4.5 && greenNoteRef.current.position.z <= 5.5;
  }
  return false;
};

// Update note position and animation effects
export const updateNotePosition = (
  ref: RefObject<Mesh | null>,
  time: number,
  delta: number,
  startZ: number,
  rotationSpeed: number,
  hoverSpeed: number,
  hoverAmplitude: number
): void => {
  if (!ref.current) return;
  
  const speed = 5; // Units per second
  
  // Reset position when it passes the hit line
  if (ref.current.position.z > 10) {
    ref.current.position.z = startZ;
  } else {
    ref.current.position.z += delta * speed;
  }
  
  // Add subtle rotation and hover
  ref.current.rotation.y += delta * rotationSpeed;
  ref.current.position.y = 1 + Math.sin(time * hoverSpeed) * hoverAmplitude;
  
  // Depth-based visibility - fade in distance
  const distance = Math.abs(ref.current.position.z);
  const material = ref.current.material as Material;
  if ('emissiveIntensity' in material) {
    material.emissiveIntensity = 0.5 - Math.min(0.3, distance / 100);
  }
};

// Update hit line effects
export const updateHitLine = (
  hitLineRef: RefObject<Mesh | null>,
  lastHit: number | null,
  time: number
): void => {
  if (!hitLineRef.current) return;
  
  if (lastHit !== null) {
    // Pulse when a note is hit
    const scale = 1.0 + Math.sin(time * 8) * 0.08;
    hitLineRef.current.scale.set(scale, 1.2, 1);
    
    // Material glow pulse
    const material = hitLineRef.current.material as Material;
    if (material && 'emissiveIntensity' in material) {
      material.emissiveIntensity = 0.8 + Math.sin(time * 8) * 0.4;
    }
  } else {
    // Subtle ambient movement when not hit
    const scale = 1.0 + Math.sin(time * 3) * 0.02;
    hitLineRef.current.scale.set(scale, 1, 1);
    
    // Material subtle glow
    const material = hitLineRef.current.material as Material;
    if (material && 'emissiveIntensity' in material) {
      material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.1;
    }
  }
};

// Update highway effects
export const updateHighway = (
  highwayRef: RefObject<Mesh | null>,
  time: number
): void => {
  if (!highwayRef.current) return;
  
  // Add subtle wave effect to highway
  const highwayMaterial = highwayRef.current.material as Material;
  if (highwayMaterial && 'emissiveIntensity' in highwayMaterial) {
    highwayMaterial.emissiveIntensity = 0.1 + Math.sin(time * 2) * 0.05;
  }
};

// Update hit ring effects
export const updateHitRings = (
  hitRingRefs: MutableRefObject<Mesh[]>,
  time: number,
  lastHit: number | null,
  missedInput: number | null
): void => {
  hitRingRefs.current.forEach((ring, i) => {
    if (ring) {
      // Subtle pulsing animation
      const pulseFactor = 1.0 + Math.sin(time * 2 + i * 0.5) * 0.05;
      ring.scale.set(pulseFactor, pulseFactor, 1);
      
      // Enhanced glow when hit
      const material = ring.material as Material;
      if (material && 'emissiveIntensity' in material) {
        // Default pulse
        let intensity = 0.4 + Math.sin(time * 2 + i) * 0.1;
        
        // Boost intensity when hit
        if (lastHit === i) {
          intensity = 1.0;
          // Flash effect
          ring.scale.set(1.2, 1.2, 1);
        }
        
        // Dim when missed
        if (missedInput === i) {
          intensity = 0.2;
          // Subtle shake effect
          ring.position.x += Math.sin(time * 20) * 0.02;
        } else {
          ring.position.x = (i - 1.5) * 2; // Reset position
        }
        
        material.emissiveIntensity = intensity;
      }
    }
  });
}; 