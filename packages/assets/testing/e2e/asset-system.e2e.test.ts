import { describe, it, expect } from 'vitest';
import { loadSound, loadSprite, getAssetStatus, AssetStatus } from '../../src';
import { soundAssets } from '../../sounds';
import { spriteAssets } from '../../sprites';

describe('Asset System E2E', () => {
  it('should handle loading a complete game scene', async () => {
    // Define a scene's worth of assets
    const sceneAssets = {
      sounds: [
        soundAssets.mainTheme,
        soundAssets.buttonClick,
        soundAssets.jump,
        soundAssets.land
      ],
      sprites: [
        spriteAssets.playerIdle,
        spriteAssets.playerRun,
        spriteAssets.background,
        spriteAssets.tileset,
        spriteAssets.buttons,
        spriteAssets.explosion
      ]
    };
    
    // Start loading all assets (typical game loading screen)
    const soundPromises = sceneAssets.sounds.map(sound => loadSound(sound));
    const spritePromises = sceneAssets.sprites.map(sprite => loadSprite(sprite));
    
    // Wait for all assets to load
    await Promise.all([...soundPromises, ...spritePromises]);
    
    // Verify all assets loaded successfully
    let allAssetsLoaded = true;
    
    // Check sounds
    for (const sound of sceneAssets.sounds) {
      const status = getAssetStatus(sound.id);
      if (status?.status !== AssetStatus.LOADED) {
        allAssetsLoaded = false;
      }
    }
    
    // Check sprites
    for (const sprite of sceneAssets.sprites) {
      const status = getAssetStatus(sprite.id);
      if (status?.status !== AssetStatus.LOADED) {
        allAssetsLoaded = false;
      }
    }
    
    expect(allAssetsLoaded).toBe(true);
  });
}); 