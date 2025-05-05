# Game Loop Package

A simple and customizable game loop implementation for the Djentronome project.

## Features

- Fixed time step or variable delta time
- Configurable FPS
- Separate update and render callbacks
- Simple start/stop API

## Usage

```typescript
import { GameLoop } from '@djentronome/game-loop';

// Create a new game loop
const gameLoop = new GameLoop({
  fps: 60, // Optional, defaults to 60
  update: (deltaTime) => {
    // Update game state here
    console.log(`Update with delta: ${deltaTime}`);
  },
  render: (deltaTime) => {
    // Render game here (optional)
    console.log(`Render with delta: ${deltaTime}`);
  }
});

// Start the game loop
gameLoop.start();

// Later, when you want to stop it
gameLoop.stop();

// Check if it's running
const isRunning = gameLoop.isRunning();
```

## API

### `GameLoop`

The main class that handles the game loop.

#### Constructor

```typescript
new GameLoop(options: GameLoopOptions)
```

#### Methods

- `start()`: Start the game loop
- `stop()`: Stop the game loop
- `isRunning()`: Check if the loop is running

### `GameLoopOptions`

Configuration options for the game loop.

```typescript
type GameLoopOptions = {
  fps?: number;           // Target frames per second (default: 60)
  update: (dt: number) => void;  // Update function called each frame
  render?: (dt: number) => void; // Optional render function
};
```
