import { ComponentType, Entity, System } from './types';

/**
 * Registry of all registered systems
 */
const systemRegistry: Map<string, System> = new Map();

/**
 * Register a system in the registry
 */
export function registerSystem(system: System): void {
  if (systemRegistry.has(system.id)) {
    throw new Error(`System with id '${system.id}' is already registered`);
  }
  
  systemRegistry.set(system.id, system);
}

/**
 * Unregister a system from the registry
 */
export function unregisterSystem(systemId: string): void {
  if (!systemRegistry.has(systemId)) {
    throw new Error(`System with id '${systemId}' is not registered`);
  }
  
  systemRegistry.delete(systemId);
}

/**
 * Get a system from the registry
 */
export function getSystem(systemId: string): System | undefined {
  return systemRegistry.get(systemId);
}

/**
 * Get all registered systems sorted by priority
 */
export function getAllSystems(): System[] {
  return Array.from(systemRegistry.values())
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Clear the system registry (useful for testing)
 */
export function clearSystemRegistry(): void {
  systemRegistry.clear();
}

/**
 * Check if an entity has all required components for a system
 */
export function entityMatchesSystem(
  entity: Entity,
  system: System, 
  hasComponent: (entityId: number, componentType: ComponentType) => boolean
): boolean {
  return system.requiredComponents.every(
    componentType => hasComponent(entity.id, componentType)
  );
} 