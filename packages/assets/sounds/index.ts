/**
 * Sound Assets Index
 */

import { SoundAsset } from '../src/types';

// Define available sound assets
export const soundAssets: Record<string, SoundAsset> = {
  // UI Sounds
  buttonClick: {
    id: 'buttonClick',
    path: '/sounds/ui/button-click.mp3',
    category: 'sfx'
  },
  menuOpen: {
    id: 'menuOpen',
    path: '/sounds/ui/menu-open.mp3',
    category: 'sfx'
  },
  
  // Game Sounds
  jump: {
    id: 'jump',
    path: '/sounds/game/jump.mp3',
    category: 'sfx'
  },
  land: {
    id: 'land',
    path: '/sounds/game/land.mp3',
    category: 'sfx'
  },
  
  // Music
  mainTheme: {
    id: 'mainTheme',
    path: '/sounds/music/main-theme.mp3',
    category: 'music',
    loop: true
  },
  battleTheme: {
    id: 'battleTheme',
    path: '/sounds/music/battle-theme.mp3',
    category: 'music',
    loop: true
  }
};

// Export individual sounds
export const { buttonClick, menuOpen, jump, land, mainTheme, battleTheme } = soundAssets; 