import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Mesh, Material } from 'three';
import { useGameStore } from '../../store/gameStore';

/**
 * Custom hook to handle hit effect animation and lifecycle
 * @param createdAt timestamp when the hit effect was created
 * @param id unique identifier for the hit effect
 */
export const useHitEffectAnimation = (createdAt: number, id: string) => {
  const meshRef = useRef<Mesh>(null);
  const { time, removeHitEffect } = useGameStore();
  
  // Animate the hit effect and remove it after a while
  useFrame(() => {
    if (meshRef.current) {
      const age = time - createdAt;
      const scale = 1 + Math.sin(age * 10) * 0.3;
      meshRef.current.scale.set(scale, scale, scale);
      
      // Access the material correctly
      const material = meshRef.current.material as Material;
      if (material && 'opacity' in material) {
        material.opacity = Math.max(0, 1 - age * 2);
      }
      
      // Remove effect when animation completes
      if (age > 0.5) {
        removeHitEffect(id);
      }
    }
  });
  
  return {
    meshRef
  };
}; 