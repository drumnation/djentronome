import { describe, it, expect, beforeEach } from 'vitest';
import { loadSound, loadSprite, getAssetStatus, AssetStatus } from './index';
import { soundAssets } from '../sounds';
import { spriteAssets } from '../sprites';

describe('Asset Loader', () => {
  beforeEach(() => {
    // Reset module state between tests if needed
    // This could be done by calling a reset function if we export one
  });
  
  it('should load a sound asset and update its status', async () => {
    const result = await loadSound(soundAssets.buttonClick);
    
    expect(result).toBe(true);
    
    const status = getAssetStatus(soundAssets.buttonClick.id);
    expect(status).toBeDefined();
    expect(status?.status).toBe(AssetStatus.LOADED);
    expect(status?.progress).toBe(1);
  });
  
  it('should load a sprite asset and update its status', async () => {
    const result = await loadSprite(spriteAssets.playerIdle);
    
    expect(result).toBe(true);
    
    const status = getAssetStatus(spriteAssets.playerIdle.id);
    expect(status).toBeDefined();
    expect(status?.status).toBe(AssetStatus.LOADED);
    expect(status?.progress).toBe(1);
  });
  
  it('should return undefined for unknown asset status', () => {
    const status = getAssetStatus('non-existent-asset');
    expect(status).toBeUndefined();
  });
}); 