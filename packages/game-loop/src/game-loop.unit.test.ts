import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GameLoop, GameLoopEventType } from './index';

/**
 * Unit tests for the enhanced GameLoop class
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

  it('should create a GameLoop instance with default options', () => {
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
  
  it('should emit events when starting and stopping', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    const startHandler = vi.fn();
    const stopHandler = vi.fn();
    
    gameLoop.on(GameLoopEventType.START, startHandler);
    gameLoop.on(GameLoopEventType.STOP, stopHandler);
    
    gameLoop.start();
    expect(startHandler).toHaveBeenCalledTimes(1);
    
    gameLoop.stop();
    expect(stopHandler).toHaveBeenCalledTimes(1);
  });
  
  it('should pause and resume the game loop', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    const pauseHandler = vi.fn();
    const resumeHandler = vi.fn();
    
    gameLoop.on(GameLoopEventType.PAUSE, pauseHandler);
    gameLoop.on(GameLoopEventType.RESUME, resumeHandler);
    
    gameLoop.start();
    
    gameLoop.pause();
    expect(gameLoop.getTimeProvider().isPaused()).toBe(true);
    expect(pauseHandler).toHaveBeenCalledTimes(1);
    
    gameLoop.resume();
    expect(gameLoop.getTimeProvider().isPaused()).toBe(false);
    expect(resumeHandler).toHaveBeenCalledTimes(1);
  });
  
  it('should use fixed timestep for updates', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn, fps: 60 });
    
    // Mock the loop function to simulate a frame
    const loopSpy = vi.spyOn(gameLoop as any, 'loop');
    
    gameLoop.start();
    
    // Call the loop function directly with a timestamp that would trigger multiple updates
    // First timestamp represents start time
    if (loopSpy.mock.calls[0]) {
      loopSpy.mock.calls[0][0] = 0;
    }
    
    // Second timestamp represents a frame that's 32ms later (about 2 fixed timesteps at 60fps)
    // 1/60 ≈ 16.67ms, so 32ms is about 2 fixed timesteps
    const timestamp = 32;
    (gameLoop as any).loop(timestamp);
    
    // Should have called update with the fixed delta time (1/60)
    expect(updateFn).toHaveBeenCalledWith(1/60);
    
    // Should have called update at least once (might be more depending on accumulated time)
    expect(updateFn.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
  
  it('should limit the maximum number of updates per frame', () => {
    const updateFn = vi.fn();
    const maxUpdates = 3;
    const gameLoop = new GameLoop({ 
      update: updateFn, 
      fps: 60,
      maxUpdatesPerFrame: maxUpdates 
    });
    
    // Mock the loop function to simulate a frame
    const loopSpy = vi.spyOn(gameLoop as any, 'loop');
    
    gameLoop.start();
    
    // Call the loop function directly with a timestamp that would trigger more updates
    // than the maximum allowed
    // First timestamp represents start time
    if (loopSpy.mock.calls[0]) {
      loopSpy.mock.calls[0][0] = 0;
    }
    
    // Second timestamp represents a frame that's much later (e.g., 100ms, which would be 6 fixed timesteps at 60fps)
    // but should be limited to maxUpdates
    const timestamp = 100;
    (gameLoop as any).loop(timestamp);
    
    // Should have limited the number of update calls to maxUpdates
    expect(updateFn).toHaveBeenCalledTimes(maxUpdates);
  });
  
  it('should provide performance statistics', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    gameLoop.start();
    
    // Mock the timestamp for a frame
    vi.spyOn(performance, 'now').mockReturnValue(16);
    
    // Get performance stats
    const stats = gameLoop.getPerformanceStats();
    
    // Stats should contain FPS-related metrics
    expect(stats).toHaveProperty('fps');
    expect(stats).toHaveProperty('frameTime');
    expect(stats).toHaveProperty('updateCount');
  });
  
  it('should handle errors in update and render calls', () => {
    // Create update and render functions that throw errors
    const updateFn = vi.fn(() => {
      throw new Error('Update error');
    });
    
    const renderFn = vi.fn(() => {
      throw new Error('Render error');
    });
    
    const gameLoop = new GameLoop({ 
      update: updateFn,
      render: renderFn
    });
    
    // Create spy for console.error
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    // Subscribe to error events
    const errorHandler = vi.fn();
    gameLoop.on(GameLoopEventType.ERROR, errorHandler);
    
    // Mock the loop function to simulate a frame
    const loopSpy = vi.spyOn(gameLoop as any, 'loop');
    
    gameLoop.start();
    
    // Call the loop function directly
    if (loopSpy.mock.calls[0]) {
      loopSpy.mock.calls[0][0] = 0;
    }
    (gameLoop as any).loop(16);
    
    // Should have logged errors to console
    expect(errorSpy).toHaveBeenCalled();
    
    // Should have emitted error events
    expect(errorHandler).toHaveBeenCalled();
    
    // Clean up
    errorSpy.mockRestore();
  });
  
  it('should adjust simulation speed with time scale', () => {
    const updateFn = vi.fn();
    const gameLoop = new GameLoop({ update: updateFn });
    
    // Default time scale should be 1.0
    expect(gameLoop.getTimeScale()).toBe(1.0);
    
    // Set time scale to half speed
    gameLoop.setTimeScale(0.5);
    expect(gameLoop.getTimeScale()).toBe(0.5);
    
    // Set time scale to double speed
    gameLoop.setTimeScale(2.0);
    expect(gameLoop.getTimeScale()).toBe(2.0);
  });
}); 