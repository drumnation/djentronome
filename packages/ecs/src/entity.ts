import { Entity, EntityId } from './types';

/**
 * Entity counter for generating unique IDs
 */
let nextEntityId = 1;

/**
 * Create a new entity with a unique ID
 */
export function createEntity(name?: string): Entity {
  const entity: Entity = {
    id: nextEntityId++,
    name
  };
  
  return entity;
}

/**
 * Reset the entity ID counter (useful for testing)
 */
export function resetEntityCounter(): void {
  nextEntityId = 1;
} 