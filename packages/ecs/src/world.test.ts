import { describe, expect, it, beforeEach, vi } from 'vitest';
import { WorldImpl } from './world';
import { resetEntityCounter } from './entity';
import { Component, Entity, System } from './types';

// Test component classes
class PositionComponent implements Component {
  type = 'position';
  
  constructor(
    public entityId: number,
    public x: number = 0,
    public y: number = 0
  ) {}
}

class VelocityComponent implements Component {
  type = 'velocity';
  
  constructor(
    public entityId: number,
    public vx: number = 0,
    public vy: number = 0
  ) {}
}

describe('World', () => {
  let world: WorldImpl;

  beforeEach(() => {
    resetEntityCounter();
    world = new WorldImpl();
  });

  describe('entity management', () => {
    it('should create entities with unique IDs', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      
      expect(entity1.id).toBe(1);
      expect(entity2.id).toBe(2);
    });

    it('should remove entities', () => {
      const entity = world.createEntity();
      world.removeEntity(entity.id);
      
      expect(() => {
        world.removeEntity(entity.id);
      }).toThrow(/does not exist/);
    });
  });

  describe('component management', () => {
    it('should add components to entities', () => {
      const entity = world.createEntity();
      const position = new PositionComponent(entity.id, 10, 20);
      
      world.addComponent(entity.id, position);
      
      const retrieved = world.getComponent<PositionComponent>(entity.id, 'position');
      expect(retrieved).toBe(position);
    });

    it('should throw when adding component to non-existent entity', () => {
      const position = new PositionComponent(999);
      
      expect(() => {
        world.addComponent(999, position);
      }).toThrow(/does not exist/);
    });

    it('should throw when adding component with mismatched entity ID', () => {
      const entity = world.createEntity();
      const position = new PositionComponent(999); // Different ID
      
      expect(() => {
        world.addComponent(entity.id, position);
      }).toThrow(/belongs to entity/);
    });

    it('should remove components from entities', () => {
      const entity = world.createEntity();
      const position = new PositionComponent(entity.id);
      
      world.addComponent(entity.id, position);
      world.removeComponent(entity.id, 'position');
      
      const retrieved = world.getComponent(entity.id, 'position');
      expect(retrieved).toBeUndefined();
    });

    it('should throw when removing component from non-existent entity', () => {
      expect(() => {
        world.removeComponent(999, 'position');
      }).toThrow(/does not exist/);
    });

    it('should throw when removing non-existent component', () => {
      const entity = world.createEntity();
      
      expect(() => {
        world.removeComponent(entity.id, 'position');
      }).toThrow(/does not have component/);
    });

    it('should check if entity has component', () => {
      const entity = world.createEntity();
      const position = new PositionComponent(entity.id);
      
      world.addComponent(entity.id, position);
      
      expect(world.hasComponent(entity.id, 'position')).toBe(true);
      expect(world.hasComponent(entity.id, 'velocity')).toBe(false);
    });

    it('should return false when checking component on non-existent entity', () => {
      expect(world.hasComponent(999, 'position')).toBe(false);
    });

    it('should get entities with specific components', () => {
      const entity1 = world.createEntity();
      const entity2 = world.createEntity();
      const entity3 = world.createEntity();
      
      world.addComponent(entity1.id, new PositionComponent(entity1.id));
      world.addComponent(entity1.id, new VelocityComponent(entity1.id));
      
      world.addComponent(entity2.id, new PositionComponent(entity2.id));
      
      world.addComponent(entity3.id, new VelocityComponent(entity3.id));
      
      const entitiesWithBoth = world.getEntitiesWith(['position', 'velocity']);
      expect(entitiesWithBoth).toHaveLength(1);
      expect(entitiesWithBoth[0].id).toBe(entity1.id);
      
      const entitiesWithPosition = world.getEntitiesWith(['position']);
      expect(entitiesWithPosition).toHaveLength(2);
      
      const entitiesWithVelocity = world.getEntitiesWith(['velocity']);
      expect(entitiesWithVelocity).toHaveLength(2);
    });
  });

  describe('system management', () => {
    it('should add systems', () => {
      const initFn = vi.fn();
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position'],
        init: initFn,
        update: vi.fn()
      };
      
      world.addSystem(system);
      
      expect(initFn).toHaveBeenCalledWith(world);
    });

    it('should throw when adding system with duplicate ID', () => {
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position'],
        update: vi.fn()
      };
      
      world.addSystem(system);
      
      expect(() => {
        world.addSystem({ ...system });
      }).toThrow(/already exists/);
    });

    it('should remove systems', () => {
      const cleanupFn = vi.fn();
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position'],
        cleanup: cleanupFn,
        update: vi.fn()
      };
      
      world.addSystem(system);
      world.removeSystem('test');
      
      expect(cleanupFn).toHaveBeenCalled();
    });

    it('should throw when removing non-existent system', () => {
      expect(() => {
        world.removeSystem('nonexistent');
      }).toThrow(/does not exist/);
    });

    it('should update systems with matching entities', () => {
      const entity1 = world.createEntity('entity1');
      const entity2 = world.createEntity('entity2');
      
      world.addComponent(entity1.id, new PositionComponent(entity1.id));
      world.addComponent(entity1.id, new VelocityComponent(entity1.id));
      world.addComponent(entity2.id, new PositionComponent(entity2.id));
      
      const updateFn = vi.fn();
      const system: System = {
        id: 'movement',
        priority: 1,
        requiredComponents: ['position', 'velocity'],
        update: updateFn
      };
      
      world.addSystem(system);
      world.update(1/60);
      
      expect(updateFn).toHaveBeenCalledWith(1/60, [entity1]);
    });

    it('should update systems in priority order', () => {
      const updateOrder: string[] = [];
      
      const system1: System = {
        id: 'system1',
        priority: 2,
        requiredComponents: [],
        update: () => updateOrder.push('system1')
      };
      
      const system2: System = {
        id: 'system2',
        priority: 1,
        requiredComponents: [],
        update: () => updateOrder.push('system2')
      };
      
      world.addSystem(system1);
      world.addSystem(system2);
      world.update(1/60);
      
      expect(updateOrder).toEqual(['system2', 'system1']);
    });
  });

  describe('static factory', () => {
    it('should create a new world instance', () => {
      const world = WorldImpl.create();
      expect(world).toBeInstanceOf(WorldImpl);
    });
  });
}); 