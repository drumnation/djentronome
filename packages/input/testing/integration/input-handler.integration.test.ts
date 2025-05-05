import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { InputHandler, InputDeviceType, InputEvent } from '../../src';

/**
 * Integration tests for the InputHandler class
 * Test type: Integration
 * 
 * These tests verify that the InputHandler works correctly
 * when integrating with other components or in more complex scenarios.
 */
describe('InputHandler Integration', () => {
  let inputHandler: InputHandler;
  
  // Mock window event functions
  const originalAddEventListener = window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener;
  
  beforeEach(() => {
    // Create a new input handler before each test
    inputHandler = new InputHandler();
    
    // Mock window event functions
    window.addEventListener = vi.fn((event, handler) => {
      // Store the handler for manual triggering
      if (event === 'keydown') {
        (window as any).keydownHandler = handler;
      } else if (event === 'keyup') {
        (window as any).keyupHandler = handler;
      }
    });
    
    window.removeEventListener = vi.fn();
    
    // Mock performance.now
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

  it('should work with a game state tracker', () => {
    // Create a simple game state tracker
    const gameState = {
      leftPressed: false,
      rightPressed: false,
      lastKeyPressed: '',
      keysPressed: 0
    };
    
    // Setup input handler
    inputHandler.enableKeyboard();
    
    // Register callback that updates the game state
    inputHandler.registerCallback((event: InputEvent) => {
      if (event.deviceType === InputDeviceType.Keyboard) {
        if (event.code === 'ArrowLeft') {
          gameState.leftPressed = event.pressed;
          if (event.pressed) {
            gameState.lastKeyPressed = 'ArrowLeft';
            gameState.keysPressed++;
          }
        } else if (event.code === 'ArrowRight') {
          gameState.rightPressed = event.pressed;
          if (event.pressed) {
            gameState.lastKeyPressed = 'ArrowRight';
            gameState.keysPressed++;
          }
        }
      }
    });
    
    // Simulate keypresses using the stored handlers
    (window as any).keydownHandler({ code: 'ArrowLeft' });
    expect(gameState.leftPressed).toBe(true);
    expect(gameState.lastKeyPressed).toBe('ArrowLeft');
    expect(gameState.keysPressed).toBe(1);
    
    (window as any).keydownHandler({ code: 'ArrowRight' });
    expect(gameState.rightPressed).toBe(true);
    expect(gameState.lastKeyPressed).toBe('ArrowRight');
    expect(gameState.keysPressed).toBe(2);
    
    (window as any).keyupHandler({ code: 'ArrowLeft' });
    expect(gameState.leftPressed).toBe(false);
    expect(gameState.rightPressed).toBe(true); // Still pressed
    
    (window as any).keyupHandler({ code: 'ArrowRight' });
    expect(gameState.rightPressed).toBe(false);
  });

  it('should handle multiple callbacks correctly', () => {
    // Setup input handler
    inputHandler.enableKeyboard();
    
    // Create multiple tracking objects
    const tracker1 = { called: 0, key: '' };
    const tracker2 = { called: 0, key: '' };
    
    // Register multiple callbacks
    inputHandler.registerCallback((event: InputEvent) => {
      tracker1.called++;
      tracker1.key = event.code as string;
    });
    
    inputHandler.registerCallback((event: InputEvent) => {
      tracker2.called++;
      tracker2.key = event.code as string;
    });
    
    // Simulate a keypress
    (window as any).keydownHandler({ code: 'Space' });
    
    // Verify both callbacks were called
    expect(tracker1.called).toBe(1);
    expect(tracker1.key).toBe('Space');
    expect(tracker2.called).toBe(1);
    expect(tracker2.key).toBe('Space');
    
    // Unregister one callback
    inputHandler.unregisterCallback((event: InputEvent) => {
      tracker1.called++;
      tracker1.key = event.code as string;
    });
    
    // Simulate another keypress
    (window as any).keydownHandler({ code: 'Enter' });
    
    // Second callback should still work
    expect(tracker2.called).toBe(2);
    expect(tracker2.key).toBe('Enter');
  });
}); 