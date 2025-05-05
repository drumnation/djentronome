/**
 * Assets Package for Djentronome
 * 
 * This package provides asset management functionality
 */

import { AssetLoadingInfo, AssetStatus, SoundAsset, SpriteAsset } from './types';

// Track loading status of assets
const assetLoadingStatus = new Map<string, AssetLoadingInfo>();

/**
 * Load a sound asset
 * @param asset Sound asset to load
 * @returns Promise that resolves when the asset is loaded
 */
export function loadSound(asset: SoundAsset): Promise<boolean> {
  updateAssetStatus(asset.id, AssetStatus.LOADING, 0);
  
  return new Promise((resolve, reject) => {
    // Simulated loading - to be replaced with actual loading logic
    setTimeout(() => {
      updateAssetStatus(asset.id, AssetStatus.LOADED, 1);
      resolve(true);
    }, 100);
  });
}

/**
 * Load a sprite asset
 * @param asset Sprite asset to load
 * @returns Promise that resolves when the asset is loaded
 */
export function loadSprite(asset: SpriteAsset): Promise<boolean> {
  updateAssetStatus(asset.id, AssetStatus.LOADING, 0);
  
  return new Promise((resolve, reject) => {
    // Simulated loading - to be replaced with actual loading logic
    setTimeout(() => {
      updateAssetStatus(asset.id, AssetStatus.LOADED, 1);
      resolve(true);
    }, 100);
  });
}

/**
 * Get the loading status of an asset
 * @param id Asset ID
 * @returns Asset loading info or undefined if not found
 */
export function getAssetStatus(id: string): AssetLoadingInfo | undefined {
  return assetLoadingStatus.get(id);
}

/**
 * Update the loading status of an asset
 * @param id Asset ID
 * @param status New status
 * @param progress Loading progress (0-1)
 * @param error Optional error message
 */
function updateAssetStatus(
  id: string, 
  status: AssetStatus, 
  progress: number,
  error?: string
): void {
  assetLoadingStatus.set(id, {
    status,
    progress,
    error
  });
}

export * from './types'; 