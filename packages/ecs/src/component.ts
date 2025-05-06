import { Component, ComponentType, EntityId, ComponentConstructor } from './types';

/**
 * Registry of all registered component types
 */
const componentRegistry: Map<ComponentType, ComponentConstructor<any>> = new Map();

/**
 * Register a component type in the registry
 */
export function registerComponent<T extends Component>(
  componentConstructor: ComponentConstructor<T>
): void {
  if (componentRegistry.has(componentConstructor.type)) {
    throw new Error(`Component type '${componentConstructor.type}' is already registered`);
  }
  
  componentRegistry.set(componentConstructor.type, componentConstructor);
}

/**
 * Get a component constructor from the registry
 */
export function getComponentConstructor<T extends Component>(
  componentType: ComponentType
): ComponentConstructor<T> | undefined {
  return componentRegistry.get(componentType) as ComponentConstructor<T> | undefined;
}

/**
 * Create a new component instance
 */
export function createComponent<T extends Component>(
  componentType: ComponentType,
  entityId: EntityId,
  ...args: any[]
): T {
  const ComponentClass = getComponentConstructor<T>(componentType);
  
  if (!ComponentClass) {
    throw new Error(`Component type '${componentType}' is not registered`);
  }
  
  return new ComponentClass(entityId, ...args);
}

/**
 * Clear the component registry (useful for testing)
 */
export function clearComponentRegistry(): void {
  componentRegistry.clear();
} 