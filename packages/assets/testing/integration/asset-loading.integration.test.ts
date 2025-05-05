import { describe, it, expect } from 'vitest';
import { loadSound, loadSprite, getAssetStatus, AssetStatus } from '../../src';
import { soundAssets } from '../../sounds';
import { spriteAssets } from '../../sprites';

describe('Asset Loading Integration', () => {
  it('should load multiple assets in sequence', async () => {
    // Load a series of assets
    await loadSound(soundAssets.buttonClick);
    await loadSound(soundAssets.mainTheme);
    await loadSprite(spriteAssets.playerIdle);
    await loadSprite(spriteAssets.background);
    
    // Check all assets are loaded
    const soundStatus1 = getAssetStatus(soundAssets.buttonClick.id);
    const soundStatus2 = getAssetStatus(soundAssets.mainTheme.id);
    const spriteStatus1 = getAssetStatus(spriteAssets.playerIdle.id);
    const spriteStatus2 = getAssetStatus(spriteAssets.background.id);
    
    expect(soundStatus1?.status).toBe(AssetStatus.LOADED);
    expect(soundStatus2?.status).toBe(AssetStatus.LOADED);
    expect(spriteStatus1?.status).toBe(AssetStatus.LOADED);
    expect(spriteStatus2?.status).toBe(AssetStatus.LOADED);
  });
  
  it('should load multiple assets in parallel', async () => {
    // Load assets in parallel
    const promises = [
      loadSound(soundAssets.jump),
      loadSound(soundAssets.land),
      loadSprite(spriteAssets.playerRun),
      loadSprite(spriteAssets.explosion)
    ];
    
    await Promise.all(promises);
    
    // Check all assets are loaded
    const assets = [
      soundAssets.jump.id,
      soundAssets.land.id,
      spriteAssets.playerRun.id,
      spriteAssets.explosion.id
    ];
    
    assets.forEach(id => {
      const status = getAssetStatus(id);
      expect(status?.status).toBe(AssetStatus.LOADED);
      expect(status?.progress).toBe(1);
    });
  });
}); 