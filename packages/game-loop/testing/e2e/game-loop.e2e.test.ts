import { describe, it, expect, vi, beforeAll, afterAll, beforeEach } from 'vitest';
import { GameLoop } from '../../src';

/**
 * E2E tests for the GameLoop class
 * Test type: Backend E2E
 * 
 * These tests verify that the GameLoop works in a more complete
 * end-to-end scenario, simulating real usage.
 */
describe('GameLoop E2E', () => {
  // Since this is a browser-based component, we'll create a simulated 
  // environment to test as close to E2E as possible without a browser
  let gameLoop: GameLoop;
  let gameState: {
    frames: number;
    timestamp: number;
    running: boolean;
  };
  
  // Mock window functions
  beforeAll(() => {
    // Setup mocks for browser APIs
    vi.stubGlobal('performance', {
      now: vi.fn().mockReturnValue(0)
    });
    
    vi.stubGlobal('requestAnimationFrame', vi.fn().mockImplementation((callback) => {
      // Simulate browser requesting animation frame
      setTimeout(() => {
        if (gameState.running) {
          const nextTimestamp = gameState.timestamp + 16.67; // ~60fps
          gameState.timestamp = nextTimestamp;
          callback(nextTimestamp);
        }
      }, 0);
      return Math.floor(Math.random() * 1000); // Random ID
    }));
    
    vi.stubGlobal('cancelAnimationFrame', vi.fn());
  });
  
  afterAll(() => {
    vi.unstubAllGlobals();
  });
  
  beforeEach(() => {
    // Reset state
    gameState = {
      frames: 0,
      timestamp: 0,
      running: false
    };
    
    // Create game loop
    gameLoop = new GameLoop({
      fps: 60,
      update: (deltaTime) => {
        gameState.frames++;
      }
    });
  });
  
  it('should run for multiple frames in an E2E scenario', async () => {
    // Set game as running
    gameState.running = true;
    
    // Start the game loop
    gameLoop.start();
    
    // Let it run for a simulated amount of time
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        // Stop after some time has passed
        gameLoop.stop();
        gameState.running = false;
        resolve();
      }, 100); // Run for 100ms
    });
    
    // Should have processed at least one frame
    expect(gameState.frames).toBeGreaterThan(0);
  });
}); 