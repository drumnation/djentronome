import { describe, expect, it, beforeEach, vi } from 'vitest';
import { WorldImpl } from '../../src/world';
import { Component, System } from '../../src/types';
import { resetEntityCounter } from '../../src/entity';

// Define test components
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

class HealthComponent implements Component {
  type = 'health';
  
  constructor(
    public entityId: number,
    public current: number = 100,
    public max: number = 100
  ) {}
}

describe('ECS Integration', () => {
  let world: WorldImpl;

  beforeEach(() => {
    resetEntityCounter();
    world = new WorldImpl();
  });

  it('should support a complete game loop with multiple systems', () => {
    // Create movement system
    const movementSystem: System = {
      id: 'movement',
      priority: 1,
      requiredComponents: ['position', 'velocity'],
      update: (dt, entities) => {
        for (const entity of entities) {
          const position = world.getComponent<PositionComponent>(entity.id, 'position')!;
          const velocity = world.getComponent<VelocityComponent>(entity.id, 'velocity')!;
          
          position.x += velocity.vx * dt;
          position.y += velocity.vy * dt;
        }
      }
    };

    // Create health system
    const healthSystem: System = {
      id: 'health',
      priority: 2,
      requiredComponents: ['health'],
      update: (dt, entities) => {
        for (const entity of entities) {
          const health = world.getComponent<HealthComponent>(entity.id, 'health')!;
          
          // Regenerate health over time (1 per second)
          if (health.current < health.max) {
            health.current = Math.min(health.max, health.current + dt);
          }
        }
      }
    };

    // Create player entity
    const player = world.createEntity('player');
    world.addComponent(player.id, new PositionComponent(player.id, 10, 10));
    world.addComponent(player.id, new VelocityComponent(player.id, 5, 3));
    world.addComponent(player.id, new HealthComponent(player.id, 50, 100));

    // Create enemy entity (has position but no velocity)
    const enemy = world.createEntity('enemy');
    world.addComponent(enemy.id, new PositionComponent(enemy.id, 50, 50));
    world.addComponent(enemy.id, new HealthComponent(enemy.id, 30, 100));

    // Register systems
    world.addSystem(movementSystem);
    world.addSystem(healthSystem);

    // Run a few update cycles (simulate gameplay)
    const dt = 1/60; // 60 FPS
    
    // Update for 10 frames
    for (let i = 0; i < 10; i++) {
      world.update(dt);
    }

    // Player should have moved
    const playerPosition = world.getComponent<PositionComponent>(player.id, 'position')!;
    expect(playerPosition.x).toBeCloseTo(10 + 5 * dt * 10);
    expect(playerPosition.y).toBeCloseTo(10 + 3 * dt * 10);

    // Enemy should not have moved
    const enemyPosition = world.getComponent<PositionComponent>(enemy.id, 'position')!;
    expect(enemyPosition.x).toBe(50);
    expect(enemyPosition.y).toBe(50);

    // Health should have regenerated slightly
    const playerHealth = world.getComponent<HealthComponent>(player.id, 'health')!;
    const enemyHealth = world.getComponent<HealthComponent>(enemy.id, 'health')!;
    
    expect(playerHealth.current).toBeGreaterThan(50);
    expect(enemyHealth.current).toBeGreaterThan(30);
  });

  it('should support dynamic entity/component creation and removal', () => {
    // Create a test system that counts entities
    let entityCount = 0;
    
    const countingSystem: System = {
      id: 'counter',
      priority: 1,
      requiredComponents: ['position'],
      update: (dt, entities) => {
        entityCount = entities.length;
      }
    };
    
    world.addSystem(countingSystem);
    
    // Start with no entities
    world.update(1/60);
    expect(entityCount).toBe(0);
    
    // Create an entity with position
    const entity1 = world.createEntity();
    world.addComponent(entity1.id, new PositionComponent(entity1.id));
    world.update(1/60);
    expect(entityCount).toBe(1);
    
    // Create another entity with position
    const entity2 = world.createEntity();
    world.addComponent(entity2.id, new PositionComponent(entity2.id));
    world.update(1/60);
    expect(entityCount).toBe(2);
    
    // Remove position from first entity
    world.removeComponent(entity1.id, 'position');
    world.update(1/60);
    expect(entityCount).toBe(1);
    
    // Remove second entity
    world.removeEntity(entity2.id);
    world.update(1/60);
    expect(entityCount).toBe(0);
  });
}); 