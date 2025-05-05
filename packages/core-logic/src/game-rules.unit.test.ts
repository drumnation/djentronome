import { describe, it, expect } from 'vitest';
import { GameRules } from './index';

describe('GameRules', () => {
  it('should be defined', () => {
    const rules = new GameRules();
    expect(rules).toBeDefined();
  });

  // Placeholder tests - to be updated as the actual implementation evolves
  it('should validate move correctly', () => {
    const rules = new GameRules();
    const moveData = { type: 'valid' };
    expect(rules.validateMove(moveData)).toBe(true);
  });

  it('should reject invalid moves', () => {
    const rules = new GameRules();
    const moveData = { type: 'invalid' };
    expect(rules.validateMove(moveData)).toBe(false);
  });
}); 