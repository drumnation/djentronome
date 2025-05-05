import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameState } from '../../src';

/**
 * E2E tests for the GameState store
 * Test type: Backend E2E
 * 
 * These tests verify the GameState in a full end-to-end scenario
 * simulating an entire game session.
 */
describe('Game State E2E', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { actions } = useGameState.getState();
    actions.resetScore();
    actions.resetCombo();
    actions.setPaused(false);
    
    // Reset any mocks
    vi.restoreAllMocks();
  });

  it('should handle a complete game session', async () => {
    const { actions } = useGameState.getState();
    
    // Simulate a complete game session with pause, combo changes, etc.
    
    // Start game
    expect(useGameState.getState().isPaused).toBe(false);
    expect(useGameState.getState().score).toBe(0);
    expect(useGameState.getState().combo).toBe(0);
    
    // First section: Player builds combo
    for (let i = 0; i < 5; i++) {
      actions.incrementCombo();
      actions.addScore(100);
    }
    
    // Save mid-game state
    const midGameState = {
      score: useGameState.getState().score,
      combo: useGameState.getState().combo
    };
    
    // Player pauses game (e.g., to answer a phone call)
    actions.setPaused(true);
    expect(useGameState.getState().isPaused).toBe(true);
    
    // Wait some time (simulating real pause)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Resume game
    actions.setPaused(false);
    expect(useGameState.getState().isPaused).toBe(false);
    
    // Verify state preserved through pause
    expect(useGameState.getState().score).toBe(midGameState.score);
    expect(useGameState.getState().combo).toBe(midGameState.combo);
    
    // Second section: Player misses a note, breaking combo
    actions.resetCombo();
    expect(useGameState.getState().combo).toBe(1);
    
    // Player builds combo again
    for (let i = 0; i < 3; i++) {
      actions.incrementCombo();
      actions.addScore(100);
    }
    
    // Final state verification
    expect(useGameState.getState().combo).toBe(4);
    expect(useGameState.getState().score).toBeGreaterThan(0);
    expect(useGameState.getState().isPaused).toBe(false);
  });

  it('should handle resetting the game state', () => {
    const { actions } = useGameState.getState();
    
    // Build up some state
    actions.incrementCombo();
    actions.incrementCombo();
    actions.addScore(500);
    actions.setPaused(true);
    
    expect(useGameState.getState().score).toBe(500);
    expect(useGameState.getState().combo).toBe(2);
    expect(useGameState.getState().isPaused).toBe(true);
    
    // Reset game (e.g., starting a new game)
    actions.resetScore();
    actions.resetCombo();
    actions.setPaused(false);
    
    // Verify reset state
    expect(useGameState.getState().score).toBe(0);
    expect(useGameState.getState().combo).toBe(1); // resetCombo sets to 1
    expect(useGameState.getState().isPaused).toBe(false);
  });
}); 