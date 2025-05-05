import { describe, it, expect, beforeEach } from 'vitest';
import { useGameState } from './index';

/**
 * Unit tests for the GameState store
 * Test type: Unit
 */
describe('Game State', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { actions } = useGameState.getState();
    actions.resetScore();
    actions.resetCombo();
    actions.setPaused(false);
  });

  it('should initialize with default values', () => {
    const state = useGameState.getState();
    expect(state.score).toBe(0);
    expect(state.isPaused).toBe(false);
    expect(state.combo).toBe(0);
  });

  it('should add score', () => {
    const { actions } = useGameState.getState();
    actions.addScore(100);
    
    const state = useGameState.getState();
    expect(state.score).toBe(0); // 100 * 0 combo = 0
    
    actions.incrementCombo(); // combo becomes 1
    actions.addScore(100);
    expect(useGameState.getState().score).toBe(100); // 100 * 1 combo = 100
  });

  it('should toggle pause state', () => {
    const { actions } = useGameState.getState();
    expect(useGameState.getState().isPaused).toBe(false);
    
    actions.togglePause();
    expect(useGameState.getState().isPaused).toBe(true);
    
    actions.togglePause();
    expect(useGameState.getState().isPaused).toBe(false);
  });

  it('should set pause state directly', () => {
    const { actions } = useGameState.getState();
    
    actions.setPaused(true);
    expect(useGameState.getState().isPaused).toBe(true);
    
    actions.setPaused(false);
    expect(useGameState.getState().isPaused).toBe(false);
  });

  it('should increment and reset combo', () => {
    const { actions } = useGameState.getState();
    expect(useGameState.getState().combo).toBe(0);
    
    actions.incrementCombo();
    expect(useGameState.getState().combo).toBe(1);
    
    actions.incrementCombo();
    expect(useGameState.getState().combo).toBe(2);
    
    actions.resetCombo();
    expect(useGameState.getState().combo).toBe(1);
  });
}); 