/**
 * Sprite Assets Index
 */

import { SpriteAsset } from '../src/types';

// Define available sprite assets
export const spriteAssets: Record<string, SpriteAsset> = {
  // Character Sprites
  playerIdle: {
    id: 'playerIdle',
    path: '/sprites/characters/player-idle.png',
    width: 32,
    height: 48,
    frames: 4,
    frameRate: 8,
    category: 'character'
  },
  playerRun: {
    id: 'playerRun',
    path: '/sprites/characters/player-run.png',
    width: 32,
    height: 48,
    frames: 6,
    frameRate: 12,
    category: 'character'
  },
  
  // Environment Sprites
  tileset: {
    id: 'tileset',
    path: '/sprites/environment/tileset.png',
    width: 256,
    height: 256,
    atlas: true,
    category: 'environment'
  },
  background: {
    id: 'background',
    path: '/sprites/environment/background.png',
    width: 512,
    height: 288,
    category: 'environment'
  },
  
  // UI Sprites
  buttons: {
    id: 'buttons',
    path: '/sprites/ui/buttons.png',
    width: 120,
    height: 30,
    frames: 3,
    category: 'ui'
  },
  
  // Effect Sprites
  explosion: {
    id: 'explosion',
    path: '/sprites/effects/explosion.png',
    width: 64,
    height: 64,
    frames: 8,
    frameRate: 15,
    category: 'effect'
  }
};

// Export individual sprites
export const { 
  playerIdle, 
  playerRun, 
  tileset, 
  background, 
  buttons, 
  explosion 
} = spriteAssets; 