import { describe, it, expect, vi } from 'vitest';
import { createGame } from '../../src';
import { GameScene } from '../../src/types';

// Mock the game-loop module to avoid actual rendering
vi.mock('@djentronome/game-loop', () => ({
  createGameLoop: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn()
  }))
}));

describe('Game Lifecycle E2E', () => {
  it('should handle a full game lifecycle', async () => {
    // Game start hooks
    const onBeforeStart = vi.fn();
    const onAfterStart = vi.fn();
    
    // Game stop hooks
    const onBeforeStop = vi.fn();
    const onAfterStop = vi.fn();
    
    // Scene lifecycle methods
    const sceneInit = vi.fn().mockResolvedValue(undefined);
    const sceneUpdate = vi.fn();
    const sceneRender = vi.fn();
    const sceneCleanup = vi.fn();
    
    // Create game
    const game = createGame({
      width: 800,
      height: 600,
      targetFps: 60
    }, {
      onBeforeStart,
      onAfterStart,
      onBeforeStop,
      onAfterStop
    });
    
    // Create scenes
    const mainMenuScene: GameScene = {
      id: 'main-menu',
      init: vi.fn().mockResolvedValue(undefined),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    const gameplayScene: GameScene = {
      id: 'gameplay',
      init: sceneInit,
      update: sceneUpdate,
      render: sceneRender,
      cleanup: sceneCleanup
    };
    
    // Simulate game startup - load main menu first
    await game.loadScene(mainMenuScene, true);
    
    // Verify main menu was initialized
    expect(mainMenuScene.init).toHaveBeenCalledTimes(1);
    expect(onBeforeStart).toHaveBeenCalledTimes(1);
    expect(onAfterStart).toHaveBeenCalledTimes(1);
    
    // Now simulate transitioning to gameplay scene
    await game.loadScene(gameplayScene);
    
    // Verify scene transition
    expect(mainMenuScene.cleanup).toHaveBeenCalledTimes(1);
    expect(sceneInit).toHaveBeenCalledTimes(1);
    
    // Simulate game shutdown
    game.stop();
    
    // Verify shutdown hooks were called
    expect(onBeforeStop).toHaveBeenCalledTimes(1);
    expect(onAfterStop).toHaveBeenCalledTimes(1);
    
    // State should reflect game stopped
    expect(game.getState().running).toBe(false);
  });
}); 