import { describe, it, expect, beforeEach } from 'vitest';
import { useGameState } from '../../src';

/**
 * Integration tests for the GameState store
 * Test type: Integration
 * 
 * These tests verify that the GameState works in more complex scenarios
 * where multiple actions are performed in sequence.
 */
describe('Game State Integration', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { actions } = useGameState.getState();
    actions.resetScore();
    actions.resetCombo();
    actions.setPaused(false);
  });

  it('should handle a typical gameplay sequence', () => {
    const { actions } = useGameState.getState();
    
    // Start with defaults
    expect(useGameState.getState().score).toBe(0);
    expect(useGameState.getState().combo).toBe(0);
    expect(useGameState.getState().isPaused).toBe(false);
    
    // Player starts game and hits first few notes
    actions.incrementCombo(); // 1x
    actions.addScore(100); // 100 points
    expect(useGameState.getState().score).toBe(100);
    
    actions.incrementCombo(); // 2x
    actions.addScore(100); // 200 points
    expect(useGameState.getState().score).toBe(300); // 100 + 200
    
    // Player pauses the game
    actions.togglePause();
    expect(useGameState.getState().isPaused).toBe(true);
    
    // Unpauses and continues
    actions.togglePause();
    expect(useGameState.getState().isPaused).toBe(false);
    
    // Player misses a note, breaking combo
    actions.resetCombo(); // back to 1x
    expect(useGameState.getState().combo).toBe(1);
    
    // Player hits more notes
    actions.addScore(100); // 100 points at 1x
    expect(useGameState.getState().score).toBe(400); // 300 + 100
    
    actions.incrementCombo(); // 2x again
    actions.addScore(100); // 200 points
    expect(useGameState.getState().score).toBe(600); // 400 + 200
    
    // Final score check
    expect(useGameState.getState().score).toBe(600);
    expect(useGameState.getState().combo).toBe(2);
  });

  it('should work with multiple rapid state changes', () => {
    const { actions } = useGameState.getState();
    
    // Simulate a fast gameplay sequence
    for (let i = 0; i < 10; i++) {
      actions.incrementCombo();
      actions.addScore(10);
    }
    
    // Test final state
    expect(useGameState.getState().combo).toBe(10);
    
    // Calculate the expected score: 10 + 20 + 30 + ... + 100 = 550
    const expectedScore = Array.from({ length: 10 }, (_, i) => 10 * (i + 1)).reduce((sum, val) => sum + val, 0);
    expect(useGameState.getState().score).toBe(expectedScore);
  });
}); 