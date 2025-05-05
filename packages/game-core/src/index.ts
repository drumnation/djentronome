/**
 * Game Core Package for Djentronome
 * 
 * This package provides the core game engine functionality
 */

import { createGameLoop } from '@djentronome/game-loop';
import { GameConfig, GameState, GameScene, GameHooks } from './types';

/**
 * Create a game instance
 * @param config Game configuration
 * @param hooks Optional lifecycle hooks
 * @returns Game methods and state
 */
export function createGame(config: GameConfig, hooks: GameHooks = {}) {
  // Initialize game state
  const state: GameState = {
    running: false,
    paused: false,
    fps: 0,
    width: config.width,
    height: config.height,
    time: 0
  };
  
  // Track current scene
  let currentScene: GameScene | null = null;
  
  // Create game loop
  const loop = createGameLoop({
    fps: config.targetFps || 60,
    update: (deltaTime) => {
      // Update game time
      state.time += deltaTime;
      
      // Update current scene if available
      if (currentScene && !state.paused) {
        currentScene.update(deltaTime);
      }
    },
    render: () => {
      // Render current scene if available
      if (currentScene) {
        currentScene.render();
      }
    },
    onFpsUpdate: (fps) => {
      state.fps = fps;
    }
  });
  
  return {
    /**
     * Start the game
     */
    start: async () => {
      if (state.running) return;
      
      if (hooks.onBeforeStart) {
        hooks.onBeforeStart();
      }
      
      state.running = true;
      state.paused = false;
      loop.start();
      
      if (hooks.onAfterStart) {
        hooks.onAfterStart();
      }
    },
    
    /**
     * Stop the game
     */
    stop: () => {
      if (!state.running) return;
      
      if (hooks.onBeforeStop) {
        hooks.onBeforeStop();
      }
      
      loop.stop();
      state.running = false;
      
      if (hooks.onAfterStop) {
        hooks.onAfterStop();
      }
    },
    
    /**
     * Pause the game
     */
    pause: () => {
      if (!state.running || state.paused) return;
      
      state.paused = true;
      
      if (hooks.onPause) {
        hooks.onPause();
      }
    },
    
    /**
     * Resume the game
     */
    resume: () => {
      if (!state.running || !state.paused) return;
      
      state.paused = false;
      
      if (hooks.onResume) {
        hooks.onResume();
      }
    },
    
    /**
     * Load a scene
     * @param scene Scene to load
     * @param autoStart Whether to automatically start the scene
     */
    loadScene: async (scene: GameScene, autoStart = true) => {
      // Cleanup current scene if exists
      if (currentScene) {
        currentScene.cleanup();
      }
      
      // Set new scene
      currentScene = scene;
      
      // Initialize the scene
      await scene.init();
      
      // Auto-start if requested
      if (autoStart && !state.running) {
        state.running = true;
        state.paused = false;
        loop.start();
      }
    },
    
    /**
     * Get current game state
     */
    getState: () => ({ ...state })
  };
}

export * from './types'; 