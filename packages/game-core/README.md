# Game Core Package for Djentronome

This package provides the core game engine functionality for the Djentronome game framework.

## Features

- Game lifecycle management (start, stop, pause, resume)
- Scene management and transitions
- Integration with other packages like game-loop, input, collision, etc.
- Consistent game state management
- Debug configuration

## Usage

```typescript
import { createGame } from '@djentronome/game-core';
import { createScene } from './my-scene';

// Create game instance
const game = createGame({
  width: 800,
  height: 600,
  targetFps: 60,
  containerId: 'game-container',
  backgroundColor: '#000000',
  pauseOnBlur: true,
  debug: {
    enabled: true,
    showFps: true,
    showColliders: true
  }
});

// Create scene
const myScene = createScene();

// Load scene and start the game
await game.loadScene(myScene);
await game.start();

// Game state management
game.pause();
game.resume();
game.stop();

// Get current game state
const state = game.getState();
console.log(`FPS: ${state.fps}`);
```

## Scenes

Scenes represent distinct game states, such as a main menu, level, or game over screen. Each scene implements the `GameScene` interface:

```typescript
interface GameScene {
  id: string;
  init: () => void | Promise<void>;
  update: (dt: number) => void;
  render: () => void;
  cleanup: () => void;
}
```

## Lifecycle Hooks

You can provide custom hooks to handle game lifecycle events:

```typescript
const game = createGame(config, {
  onBeforeStart: () => console.log('Game starting...'),
  onAfterStart: () => console.log('Game started!'),
  onPause: () => console.log('Game paused'),
  onResume: () => console.log('Game resumed'),
  onBeforeStop: () => console.log('Game stopping...'),
  onAfterStop: () => console.log('Game stopped!')
});
```

## Testing

```bash
# Run all tests
pnpm test

# Run specific test types
pnpm test:unit
pnpm test:integration
pnpm test:e2e
```

## License

Internal use only - Djentronome Project
