import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createGame } from '../../src';
import { GameScene } from '../../src/types';

// Mock the game-loop to avoid actual rendering
vi.mock('@djentronome/game-loop', () => ({
  createGameLoop: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn()
  }))
}));

describe('Game Scene Integration', () => {
  // Setup test timer to advance time
  beforeEach(() => {
    vi.useFakeTimers();
  });
  
  afterEach(() => {
    vi.useRealTimers();
  });
  
  it('should transition between scenes correctly', async () => {
    // Create a game
    const game = createGame({
      width: 800,
      height: 600
    });
    
    // Create scenes
    const scene1: GameScene = {
      id: 'scene1',
      init: vi.fn().mockResolvedValue(undefined),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    const scene2: GameScene = {
      id: 'scene2',
      init: vi.fn().mockResolvedValue(undefined),
      update: vi.fn(),
      render: vi.fn(),
      cleanup: vi.fn()
    };
    
    // Load first scene
    await game.loadScene(scene1, true);
    
    // Start the game
    await game.start();
    
    // Simulate some game time passing
    const updateFn = (vi.mocked(createGameLoop) as any).mock.calls[0][0].update;
    updateFn(16.67); // ~60fps
    
    // Check scene1 was updated
    expect(scene1.update).toHaveBeenCalledWith(16.67);
    
    // Now transition to scene2
    await game.loadScene(scene2);
    
    // Verify cleanup called on scene1
    expect(scene1.cleanup).toHaveBeenCalledTimes(1);
    
    // Verify scene2 initialized
    expect(scene2.init).toHaveBeenCalledTimes(1);
    
    // Simulate more time passing
    updateFn(16.67);
    
    // Check scene2 is getting updated
    expect(scene2.update).toHaveBeenCalledWith(16.67);
    
    // Pause the game
    game.pause();
    
    // Simulate more time, but scene2 shouldn't be updated as game is paused
    updateFn(16.67);
    
    // scene2.update should still only have been called once
    expect(scene2.update).toHaveBeenCalledTimes(1);
    
    // Resume the game
    game.resume();
    
    // Simulate more time
    updateFn(16.67);
    
    // scene2 should be updated again
    expect(scene2.update).toHaveBeenCalledTimes(2);
  });
}); 