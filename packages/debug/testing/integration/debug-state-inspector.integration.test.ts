import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StateInspector } from '../../src';

describe('StateInspector Integration', () => {
  beforeEach(() => {
    // Mock console methods
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display state correctly', () => {
    const inspector = new StateInspector();
    const testState = { player: { health: 100, position: { x: 0, y: 0 } } };
    
    inspector.displayState(testState);
    expect(console.log).toHaveBeenCalledWith('Current state:', testState);
  });

  it('should watch state for changes', () => {
    const inspector = new StateInspector();
    const testState = { player: { health: 100, position: { x: 0, y: 0 } } };
    
    inspector.watchState(testState);
    expect(console.log).toHaveBeenCalledWith('Watching state for changes:', testState);
  });
}); 