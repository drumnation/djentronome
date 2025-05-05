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
  it('should work with a state tracking object', () => {
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
      setTimeout(() => callback(16), 0); // 16ms = ~60fps
      return 1;
    });

    // Start the loop
    gameLoop.start();

    // Wait for the RAF callback to execute
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(state.updates).toBe(1);
        expect(state.renders).toBe(1);
        
        // Cleanup
        gameLoop.stop();
        global.requestAnimationFrame = originalRAF;
        resolve();
      }, 10);
    });
  });
}); 