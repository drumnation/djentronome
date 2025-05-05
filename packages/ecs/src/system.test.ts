import { describe, expect, it, beforeEach, vi } from 'vitest';
import { 
  registerSystem, 
  unregisterSystem, 
  getSystem, 
  getAllSystems,
  clearSystemRegistry,
  entityMatchesSystem
} from './system';
import { System, Entity } from './types';

describe('System', () => {
  beforeEach(() => {
    clearSystemRegistry();
  });

  describe('registerSystem', () => {
    it('should register a system', () => {
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position', 'velocity'],
        update: vi.fn()
      };

      registerSystem(system);
      
      const retrieved = getSystem('test');
      expect(retrieved).toBe(system);
    });

    it('should throw when registering a system with the same id', () => {
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position'],
        update: vi.fn()
      };

      registerSystem(system);
      
      expect(() => {
        registerSystem({ ...system });
      }).toThrow(/already registered/);
    });
  });

  describe('unregisterSystem', () => {
    it('should unregister a system', () => {
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position'],
        update: vi.fn()
      };

      registerSystem(system);
      unregisterSystem('test');
      
      const retrieved = getSystem('test');
      expect(retrieved).toBeUndefined();
    });

    it('should throw when unregistering a non-existent system', () => {
      expect(() => {
        unregisterSystem('nonexistent');
      }).toThrow(/not registered/);
    });
  });

  describe('getAllSystems', () => {
    it('should return all registered systems sorted by priority', () => {
      const system1: System = {
        id: 'system1',
        priority: 2,
        requiredComponents: ['position'],
        update: vi.fn()
      };

      const system2: System = {
        id: 'system2',
        priority: 1,
        requiredComponents: ['velocity'],
        update: vi.fn()
      };

      registerSystem(system1);
      registerSystem(system2);
      
      const systems = getAllSystems();
      expect(systems).toHaveLength(2);
      expect(systems[0].id).toBe('system2'); // Lower priority comes first
      expect(systems[1].id).toBe('system1');
    });
  });

  describe('entityMatchesSystem', () => {
    it('should return true if entity has all required components', () => {
      const entity: Entity = { id: 1 };
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position', 'velocity'],
        update: vi.fn()
      };
      
      const hasComponent = vi.fn()
        .mockImplementation((entityId, componentType) => {
          return componentType === 'position' || componentType === 'velocity';
        });
      
      const result = entityMatchesSystem(entity, system, hasComponent);
      
      expect(result).toBe(true);
      expect(hasComponent).toHaveBeenCalledTimes(2);
    });

    it('should return false if entity is missing a required component', () => {
      const entity: Entity = { id: 1 };
      const system: System = {
        id: 'test',
        priority: 1,
        requiredComponents: ['position', 'velocity'],
        update: vi.fn()
      };
      
      const hasComponent = vi.fn()
        .mockImplementation((entityId, componentType) => {
          return componentType === 'position'; // Only has position
        });
      
      const result = entityMatchesSystem(entity, system, hasComponent);
      
      expect(result).toBe(false);
    });
  });
}); 