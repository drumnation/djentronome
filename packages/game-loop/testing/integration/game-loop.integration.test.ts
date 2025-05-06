import { describe, it, expect, vi } from 'vitest';
import { GameLoop } from '../../src';

/**
 * Integration tests for the GameLoop class
 * Test type: Integration
 * 
 * These tests verify that the GameLoop works correctly with 
 * other components in a more integrated way.
 */
describe('GameLoop Integration', () => {
  it('should work with a state tracking object', async () => {
    // Create a state tracker
    const state = {
      updates: 0,
      renders: 0,
      lastDelta: 0
    };

    // Create game loop with functions that update the state
    const gameLoop = new GameLoop({
      update: (deltaTime) => {
        state.updates += 1;
        state.lastDelta = deltaTime;
      },
      render: () => {
        state.renders += 1;
      }
    });

    // Mock requestAnimationFrame to call the callback immediately with a timestamp
    const originalRAF = global.requestAnimationFrame;
    global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      setTimeout(() => callback(performance.now()), 0); // Execute immediately
      return 1;
    });

    // Start the loop
    gameLoop.start();
    
    // Manually trigger the first frame
    // @ts-ignore - Accessing private method for testing
    (gameLoop as any).loop(performance.now());

    // Allow the promise to resolve
    await vi.waitFor(() => {
      expect(state.updates).toBeGreaterThan(0);
      expect(state.renders).toBeGreaterThan(0);
    }, { timeout: 1000 });
    
    // Ensure values were updated - the test frame may trigger multiple updates
    // We just want to verify updates are happening
    expect(state.updates).toBeGreaterThan(0);
    expect(state.renders).toBeGreaterThan(0);
    
    // Cleanup
    gameLoop.stop();
    global.requestAnimationFrame = originalRAF;
  });
}); 