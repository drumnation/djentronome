/**
 * Asset Types for Djentronome
 */

/**
 * Sound asset descriptor
 */
export interface SoundAsset {
  id: string;
  path: string;
  duration?: number;
  volume?: number;
  loop?: boolean;
  category: 'sfx' | 'music' | 'ambient' | 'voice';
}

/**
 * Sprite asset descriptor
 */
export interface SpriteAsset {
  id: string;
  path: string;
  width: number;
  height: number;
  frames?: number;
  frameRate?: number;
  atlas?: boolean;
  category: 'character' | 'environment' | 'ui' | 'effect';
}

/**
 * Asset loading status
 */
export enum AssetStatus {
  PENDING = 'pending',
  LOADING = 'loading',
  LOADED = 'loaded',
  ERROR = 'error'
}

/**
 * Asset loading info
 */
export interface AssetLoadingInfo {
  status: AssetStatus;
  progress: number;
  error?: string;
} 