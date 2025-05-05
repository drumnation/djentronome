import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop } from './index';

/**
 * Unit tests for the GameLoop class
 * Test type: Unit
 */
describe('GameLoop', () => {
  // Mock requestAnimationFrame and cancelAnimationFrame
  const originalRAF = global.requestAnimationFrame;
  const originalCAF = global.cancelAnimationFrame;
  
  beforeEach(() => {
    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(0);
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn().mockReturnValue(1);
    
    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = vi.fn();
  });
  
  afterEach(() => {
    // Restore the original implementations
    global.requestAnimationFrame = originalRAF;
    global.cancelAnimationFrame = originalCAF;
    vi.restoreAllMocks();
  });

  it('should create a GameLoop instance with default fps', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    expect(gameLoop).toBeInstanceOf(GameLoop);
  });

  it('should start the game loop when start is called', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    gameLoop.start();
    
    expect(gameLoop.isRunning()).toBe(true);
    expect(global.requestAnimationFrame).toHaveBeenCalledTimes(1);
  });

  it('should stop the game loop when stop is called', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    gameLoop.start();
    gameLoop.stop();
    
    expect(gameLoop.isRunning()).toBe(false);
    expect(global.cancelAnimationFrame).toHaveBeenCalledTimes(1);
  });
}); 