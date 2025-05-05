/**
 * Entity Component System Types for Djentronome
 */

/**
 * Unique identifier for entities
 */
export type EntityId = number;

/**
 * Base entity interface
 */
export interface Entity {
  /** Unique entity identifier */
  id: EntityId;
  
  /** Optional entity name for debugging */
  name?: string;
}

/**
 * Component type identifier
 */
export type ComponentType = string;

/**
 * Base component interface
 */
export interface Component {
  /** Component type identifier */
  type: ComponentType;
  
  /** Entity this component belongs to */
  entityId: EntityId;
}

/**
 * Component constructor interface
 */
export interface ComponentConstructor<T extends Component> {
  /** Component type identifier */
  type: ComponentType;
  
  /** Create a new component instance */
  new (entityId: EntityId, ...args: any[]): T;
}

/**
 * System interface for processing entities with specific components
 */
export interface System {
  /** Unique system identifier */
  id: string;
  
  /** Component types this system requires */
  requiredComponents: ComponentType[];
  
  /** System priority (lower value = higher priority) */
  priority: number;
  
  /** Initialize the system */
  init?: (world: World) => void;
  
  /** Update the system */
  update: (dt: number, entities: Entity[]) => void;
  
  /** Cleanup the system */
  cleanup?: () => void;
}

/**
 * World interface for managing entities, components, and systems
 */
export interface World {
  /** Create a new entity */
  createEntity: (name?: string) => Entity;
  
  /** Remove an entity and all its components */
  removeEntity: (entityId: EntityId) => void;
  
  /** Add a component to an entity */
  addComponent: <T extends Component>(entityId: EntityId, component: T) => T;
  
  /** Remove a component from an entity */
  removeComponent: (entityId: EntityId, componentType: ComponentType) => void;
  
  /** Get a component from an entity */
  getComponent: <T extends Component>(entityId: EntityId, componentType: ComponentType) => T | undefined;
  
  /** Check if an entity has a specific component */
  hasComponent: (entityId: EntityId, componentType: ComponentType) => boolean;
  
  /** Get all entities with a specific set of components */
  getEntitiesWith: (componentTypes: ComponentType[]) => Entity[];
  
  /** Add a system to the world */
  addSystem: (system: System) => void;
  
  /** Remove a system from the world */
  removeSystem: (systemId: string) => void;
  
  /** Update all systems */
  update: (dt: number) => void;
} 