import { describe, expect, it, beforeEach } from 'vitest';
import { createEntity, resetEntityCounter } from './entity';

describe('Entity', () => {
  beforeEach(() => {
    resetEntityCounter();
  });

  it('should create an entity with a unique ID', () => {
    const entity1 = createEntity();
    const entity2 = createEntity();
    
    expect(entity1.id).toBe(1);
    expect(entity2.id).toBe(2);
  });

  it('should assign the provided name', () => {
    const entity = createEntity('Player');
    
    expect(entity.name).toBe('Player');
  });

  it('should not require a name', () => {
    const entity = createEntity();
    
    expect(entity.name).toBeUndefined();
  });

  it('should allow resetting the entity counter', () => {
    createEntity();
    createEntity();
    resetEntityCounter();
    
    const entity = createEntity();
    expect(entity.id).toBe(1);
  });
}); 