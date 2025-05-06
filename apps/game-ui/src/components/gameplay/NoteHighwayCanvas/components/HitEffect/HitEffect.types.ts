import { Vector3 } from 'three';

/**
 * Data structure for a hit effect
 */
export interface HitEffectData {
  /**
   * Unique identifier for the hit effect
   */
  id: string;
  
  /**
   * 3D position of the hit effect
   */
  position: [number, number, number] | Vector3;
  
  /**
   * Color of the hit effect
   */
  color: string;
  
  /**
   * Timestamp when the hit effect was created
   */
  createdAt: number;
} 