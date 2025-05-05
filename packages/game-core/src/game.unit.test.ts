import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGame } from './index';
import { GameConfig, GameScene } from './types';

// Mock the game-loop module to avoid actual rendering
vi.mock('@djentronome/game-loop', () => ({
  createGameLoop: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn()
  }))
}));

describe('Game Core', () => {
  let config: GameConfig;
  let hooks: any;
  
  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create sample config
    config = {
      width: 800,
      height: 600,
      targetFps: 60
    };
    
    // Create hooks with spies
    hooks = {
      onBeforeStart: vi.fn(),
      onAfterStart: vi.fn(),
      onPause: vi.fn(),
      onResume: vi.fn(),
      onBeforeStop: vi.fn(),
      onAfterStop: vi.fn()
    };
  });
  
  it('should create a game with correct initial state', () => {
    const game = createGame(config);
    const state = game.getState();
    
    expect(state.running).toBe(false);
    expect(state.paused).toBe(false);
    expect(state.width).toBe(config.width);
    expect(state.height).toBe(config.height);
    expect(state.time).toBe(0);
  });
  
  it('should call lifecycle hooks during game start/stop', async () => {
    const game = createGame(config, hooks);
    
    // Start the game
    await game.start();
    expect(hooks.onBeforeStart).toHaveBeenCalledTimes(1);
    expect(hooks.onAfterStart).toHaveBeenCalledTimes(1);
    expect(game.getState().running).toBe(true);
    
    // Stop the game
    game.stop();
    expect(hooks.onBeforeStop).toHaveBeenCalledTimes(1);
    expect(hooks.onAfterStop).toHaveBeenCalledTimes(1);
    expect(game.getState().running).toBe(false);
  });
  
  it('should call hooks during pause/resume', async () => {
    const game = createGame(config, hooks);
    
    // Start the game first
    await game.start();
    
    // Pause the game
    game.pause();
    expect(hooks.onPause).toHaveBeenCalledTimes(1);
    expect(game.getState().paused).toBe(true);
    
    // Resume the game
    game.resume();
    expect(hooks.onResume).toHaveBeenCalledTimes(1);
    expect(game.getState().paused).toBe(false);
  });
  
  it('should load a scene', async () => {
    const game = createGame(config);
    
    // Create a mock scene
    const scene: GameScene = {
      id: 'test-scene',
      init: vi.fn(),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    // Load the scene
    await game.loadScene(scene, false);
    
    // Verify scene was initialized
    expect(scene.init).toHaveBeenCalledTimes(1);
  });
  
  it('should cleanup previous scene when loading a new one', async () => {
    const game = createGame(config);
    
    // Create mock scenes
    const scene1: GameScene = {
      id: 'scene-1',
      init: vi.fn(),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    const scene2: GameScene = {
      id: 'scene-2',
      init: vi.fn(),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    // Load first scene
    await game.loadScene(scene1, false);
    
    // Then load second scene
    await game.loadScene(scene2, false);
    
    // Verify first scene was cleaned up
    expect(scene1.cleanup).toHaveBeenCalledTimes(1);
  });
}); 