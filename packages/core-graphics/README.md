# Core Graphics Package

Core graphics implementation for the Djentronome project.

## Features

- Rendering abstractions
- Graphics utilities
- Canvas/WebGL handling
- Sprite and animation rendering

## Usage

```typescript
import { Renderer, Sprite } from '@djentronome/core-graphics';

// Initialize renderer
const renderer = new Renderer({
  width: 800,
  height: 600,
  target: document.getElementById('game-canvas')
});

// Create and render a sprite
const sprite = new Sprite({
  texture: 'path/to/texture.png',
  position: { x: 100, y: 100 },
  scale: { x: 1, y: 1 }
});

renderer.renderSprite(sprite);
```

## API

### `Renderer`

The main rendering class that handles drawing to the canvas.

#### Constructor Options

```typescript
{
  width: number;      // Width of the renderer
  height: number;     // Height of the renderer
  target?: HTMLElement; // Element to append the canvas to
  clearColor?: string;  // Background color (default: '#000000')
}
```

#### Methods

- `clear()`: Clear the canvas
- `renderSprite(sprite)`: Render a sprite to the canvas
- `resize(width, height)`: Resize the renderer

### `Sprite`

A class representing a drawable sprite.

#### Constructor Options

```typescript
{
  texture: string;    // Path to the texture
  position: { x: number, y: number }; // Position on screen
  scale?: { x: number, y: number };   // Scale (default: { x: 1, y: 1 })
}
```

## Development

This package follows the monorepo testing structure:

- Unit tests: `src/*.unit.test.ts`
- Integration tests: `testing/integration/*.integration.test.ts`
- E2E tests: `testing/e2e/*.e2e.test.ts`

To run tests:

```bash
# Run all tests
pnpm test

# Run only unit tests
pnpm test:unit

# Run only integration tests
pnpm test:integration

# Run only e2e tests
pnpm test:e2e
``` 