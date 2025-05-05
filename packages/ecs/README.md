# @djentronome/ecs

A lightweight and performant Entity Component System (ECS) for the Djentronome game engine.

## Overview

This package provides a complete ECS implementation for game development, allowing for efficient organization and processing of game objects. The ECS pattern separates entities (game objects) from their data (components) and behavior (systems), enabling better code organization, improved performance, and greater flexibility.

## Key Features

- **Entities**: Simple, unique identifiers for game objects
- **Components**: Pure data containers attached to entities
- **Systems**: Logic for processing entities with specific components
- **World**: Central manager for entities, components, and systems

## Installation

```bash
pnpm add @djentronome/ecs
```

## Usage

### Basic Example

```typescript
import { WorldImpl, Component, System } from '@djentronome/ecs';

// Define components
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

// Define a movement system
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

// Create a world
const world = WorldImpl.create();

// Add system
world.addSystem(movementSystem);

// Create entity
const entity = world.createEntity('player');

// Add components
world.addComponent(entity.id, new PositionComponent(entity.id, 0, 0));
world.addComponent(entity.id, new VelocityComponent(entity.id, 5, 10));

// Game loop
function gameLoop(dt: number) {
  world.update(dt);
  requestAnimationFrame(() => gameLoop(1/60));
}

gameLoop(1/60);
```

## API Reference

### Entity

```typescript
interface Entity {
  id: number;
  name?: string;
}

// Create a new entity
function createEntity(name?: string): Entity;
```

### Component

```typescript
interface Component {
  type: string;
  entityId: number;
}

// Register a component type
function registerComponent<T extends Component>(componentConstructor: ComponentConstructor<T>): void;

// Create a component instance
function createComponent<T extends Component>(
  componentType: string, 
  entityId: number, 
  ...args: any[]
): T;
```

### System

```typescript
interface System {
  id: string;
  priority: number;
  requiredComponents: string[];
  init?: (world: World) => void;
  update: (dt: number, entities: Entity[]) => void;
  cleanup?: () => void;
}

// Register a system
function registerSystem(system: System): void;
```

### World

```typescript
interface World {
  createEntity(name?: string): Entity;
  removeEntity(entityId: number): void;
  
  addComponent<T extends Component>(entityId: number, component: T): T;
  removeComponent(entityId: number, componentType: string): void;
  getComponent<T extends Component>(entityId: number, componentType: string): T | undefined;
  hasComponent(entityId: number, componentType: string): boolean;
  
  getEntitiesWith(componentTypes: string[]): Entity[];
  
  addSystem(system: System): void;
  removeSystem(systemId: string): void;
  
  update(dt: number): void;
}

// Create a new world
const world = WorldImpl.create();
```

## Best Practices

1. **Component Design**: Keep components small and focused on a single aspect of an entity
2. **System Responsibility**: Each system should have a single responsibility
3. **Entity Composition**: Prefer composition over inheritance by combining components
4. **Performance**: Use the `getEntitiesWith` method to efficiently process only relevant entities

## Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration
```

## License

MIT
