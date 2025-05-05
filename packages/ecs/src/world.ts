import { Component, ComponentType, Entity, EntityId, System, World } from './types';
import { createEntity } from './entity';
import { entityMatchesSystem, getAllSystems } from './system';

/**
 * Implementation of the World interface
 */
export class WorldImpl implements World {
  private entities: Map<EntityId, Entity> = new Map();
  private components: Map<EntityId, Map<ComponentType, Component>> = new Map();
  private systems: Map<string, System> = new Map();

  /**
   * Create a new entity in the world
   */
  createEntity(name?: string): Entity {
    const entity = createEntity(name);
    this.entities.set(entity.id, entity);
    this.components.set(entity.id, new Map());
    return entity;
  }

  /**
   * Remove an entity and all its components from the world
   */
  removeEntity(entityId: EntityId): void {
    if (!this.entities.has(entityId)) {
      throw new Error(`Entity with id ${entityId} does not exist`);
    }

    this.entities.delete(entityId);
    this.components.delete(entityId);
  }

  /**
   * Add a component to an entity
   */
  addComponent<T extends Component>(entityId: EntityId, component: T): T {
    if (!this.entities.has(entityId)) {
      throw new Error(`Entity with id ${entityId} does not exist`);
    }

    const entityComponents = this.components.get(entityId)!;
    
    if (component.entityId !== entityId) {
      throw new Error(`Component belongs to entity ${component.entityId}, not ${entityId}`);
    }

    entityComponents.set(component.type, component);
    return component;
  }

  /**
   * Remove a component from an entity
   */
  removeComponent(entityId: EntityId, componentType: ComponentType): void {
    if (!this.entities.has(entityId)) {
      throw new Error(`Entity with id ${entityId} does not exist`);
    }

    const entityComponents = this.components.get(entityId)!;
    
    if (!entityComponents.has(componentType)) {
      throw new Error(`Entity ${entityId} does not have component ${componentType}`);
    }

    entityComponents.delete(componentType);
  }

  /**
   * Get a component from an entity
   */
  getComponent<T extends Component>(entityId: EntityId, componentType: ComponentType): T | undefined {
    if (!this.entities.has(entityId)) {
      return undefined;
    }

    const entityComponents = this.components.get(entityId)!;
    return entityComponents.get(componentType) as T | undefined;
  }

  /**
   * Check if an entity has a specific component
   */
  hasComponent(entityId: EntityId, componentType: ComponentType): boolean {
    if (!this.entities.has(entityId)) {
      return false;
    }

    const entityComponents = this.components.get(entityId)!;
    return entityComponents.has(componentType);
  }

  /**
   * Get all entities with a specific set of components
   */
  getEntitiesWith(componentTypes: ComponentType[]): Entity[] {
    return Array.from(this.entities.values()).filter(entity => 
      componentTypes.every(componentType => this.hasComponent(entity.id, componentType))
    );
  }

  /**
   * Add a system to the world
   */
  addSystem(system: System): void {
    if (this.systems.has(system.id)) {
      throw new Error(`System with id ${system.id} already exists`);
    }

    this.systems.set(system.id, system);
    
    if (system.init) {
      system.init(this);
    }
  }

  /**
   * Remove a system from the world
   */
  removeSystem(systemId: string): void {
    const system = this.systems.get(systemId);
    
    if (!system) {
      throw new Error(`System with id ${systemId} does not exist`);
    }

    if (system.cleanup) {
      system.cleanup();
    }

    this.systems.delete(systemId);
  }

  /**
   * Update all systems
   */
  update(dt: number): void {
    // Get all systems sorted by priority
    const sortedSystems = Array.from(this.systems.values())
      .sort((a, b) => a.priority - b.priority);
    
    // Update each system with entities that match its requirements
    for (const system of sortedSystems) {
      const matchingEntities = this.getEntitiesForSystem(system);
      system.update(dt, matchingEntities);
    }
  }

  /**
   * Get all entities that match a system's required components
   */
  private getEntitiesForSystem(system: System): Entity[] {
    return Array.from(this.entities.values()).filter(entity => 
      entityMatchesSystem(entity, system, this.hasComponent.bind(this))
    );
  }

  /**
   * Create a new world instance
   */
  static create(): World {
    return new WorldImpl();
  }
} 