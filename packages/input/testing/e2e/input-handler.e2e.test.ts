import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InputHandler, InputDeviceType, InputEvent } from '../../src';

/**
 * E2E tests for the InputHandler class
 * Test type: Backend E2E
 * 
 * These tests verify the InputHandler in an end-to-end scenario
 * simulating a full game input flow.
 */
describe('InputHandler E2E', () => {
  let inputHandler: InputHandler;
  
  // Mock window event functions
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  
  // Game state object for end-to-end testing
  let gameState: {
    playerPosition: { x: number, y: number };
    isJumping: boolean;
    isPaused: boolean;
    keyStates: Record<string, boolean>;
    history: string[];
  };
  
  beforeEach(() => {
    // Create a new input handler
    inputHandler = new InputHandler();
    
    // Initialize game state
    gameState = {
      playerPosition: { x: 0, y: 0 },
      isJumping: false,
      isPaused: false,
      keyStates: {},
      history: []
    };
    
    // Mock window event functions with implementation that actually calls handlers
    window.addEventListener = vi.fn((event, handler) => {
      // Store the handler for manual triggering
      if (event === 'keydown') {
        (window as any).keydownHandler = handler;
      } else if (event === 'keyup') {
        (window as any).keyupHandler = handler;
      }
    });
    
    window.removeEventListener = vi.fn();
    
    // Mock performance.now with real behavior for better simulation
    vi.spyOn(performance, 'now').mockImplementation(() => Date.now());
  });
  
  afterEach(() => {
    // Restore original functions
    window.addEventListener = originalAddEventListener;
    window.removeEventListener = originalRemoveEventListener;
    vi.restoreAllMocks();
    
    // Cleanup input handler
    inputHandler.cleanup();
  });

  it('should simulate a complete gaming session', async () => {
    // Setup input handler
    inputHandler.enableKeyboard();
    
    // Register E2E game control handler
    inputHandler.registerCallback((event: InputEvent) => {
      if (event.deviceType !== InputDeviceType.Keyboard) return;
      
      // Update key state
      gameState.keyStates[event.code as string] = event.pressed;
      
      // Add to history
      gameState.history.push(`${event.code}:${event.pressed ? 'down' : 'up'}`);
      
      // Handle specific keys
      if (event.code === 'Space' && event.pressed) {
        gameState.isJumping = true;
        // Auto-reset jump after delay (simulating animation)
        setTimeout(() => {
          gameState.isJumping = false;
        }, 500);
      }
      
      if (event.code === 'Escape' && event.pressed) {
        gameState.isPaused = !gameState.isPaused;
      }
    });
    
    // Create a game update loop (simulated)
    const updateGame = () => {
      if (gameState.isPaused) return;
      
      // Move based on arrow keys
      if (gameState.keyStates['ArrowLeft']) {
        gameState.playerPosition.x -= 5;
      }
      if (gameState.keyStates['ArrowRight']) {
        gameState.playerPosition.x += 5;
      }
      if (gameState.keyStates['ArrowUp']) {
        gameState.playerPosition.y -= 5;
      }
      if (gameState.keyStates['ArrowDown']) {
        gameState.playerPosition.y += 5;
      }
    };
    
    // Simulate keypresses in a gameplay sequence
    
    // Player moves right
    (window as any).keydownHandler({ code: 'ArrowRight' });
    updateGame();
    updateGame();
    expect(gameState.playerPosition.x).toBe(10);
    
    // Player jumps while moving
    (window as any).keydownHandler({ code: 'Space' });
    expect(gameState.isJumping).toBe(true);
    
    // Player stops moving right
    (window as any).keyupHandler({ code: 'ArrowRight' });
    updateGame();
    expect(gameState.playerPosition.x).toBe(10); // No change
    
    // Player moves left
    (window as any).keydownHandler({ code: 'ArrowLeft' });
    updateGame();
    expect(gameState.playerPosition.x).toBe(5);
    
    // Player pauses game
    (window as any).keydownHandler({ code: 'Escape' });
    expect(gameState.isPaused).toBe(true);
    
    // Input shouldn't affect position while paused
    (window as any).keydownHandler({ code: 'ArrowDown' });
    updateGame();
    expect(gameState.playerPosition.y).toBe(0); // No change while paused
    
    // Player unpauses
    (window as any).keydownHandler({ code: 'Escape' });
    expect(gameState.isPaused).toBe(false);
    
    // Input works again
    updateGame();
    expect(gameState.playerPosition.y).toBe(5); // Now it changes
    
    // Wait for jump to finish
    await new Promise<void>(resolve => {
      setTimeout(() => {
        expect(gameState.isJumping).toBe(false);
        resolve();
      }, 600);
    });
    
    // Verify input history recorded all events
    expect(gameState.history.length).toBe(7);
    expect(gameState.history[0]).toBe('ArrowRight:down');
    expect(gameState.history[1]).toBe('Space:down');
  });

  it('should cleanup properly after game session', () => {
    // Setup input handler
    inputHandler.enableKeyboard();
    
    // Register some callbacks
    const callback = vi.fn();
    inputHandler.registerCallback(callback);
    
    // Verify it's registered by triggering an event
    (window as any).keydownHandler({ code: 'KeyA' });
    expect(callback).toHaveBeenCalledTimes(1);
    
    // Cleanup the input handler
    inputHandler.cleanup();
    
    // Verify removeEventListener was called to clean up listeners
    expect(window.removeEventListener).toHaveBeenCalled();
  });
}); 