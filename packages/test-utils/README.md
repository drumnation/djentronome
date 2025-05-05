# Test Utilities Package

Testing utilities and helpers for the Djentronome project.

## Features

- Mock implementations for game components
- Test helpers for common testing scenarios
- Custom test matchers
- Fixtures for game state, input, and more

## Usage

```typescript
import { createGameStateMock, createInputHandlerMock } from '@djentronome/test-utils';

// Create a mock game state for testing
const mockGameState = createGameStateMock({
  player: {
    health: 100,
    position: { x: 0, y: 0 }
  }
});

// Create a mock input handler
const mockInputHandler = createInputHandlerMock({
  keyPressed: {
    ArrowLeft: true,
    ArrowRight: false
  }
});

// Use in tests
test('player moves left when left arrow is pressed', () => {
  // Arrange
  const playerController = new PlayerController(mockGameState, mockInputHandler);
  
  // Act
  playerController.update(16); // 16ms frame
  
  // Assert
  expect(mockGameState.player.position.x).toBeLessThan(0);
});
```

## API

### Mock Factories

#### `createGameStateMock(initialState?)`

Creates a mock game state object with the specified initial state.

#### `createInputHandlerMock(options?)`

Creates a mock input handler with the specified options.

#### `createRendererMock()`

Creates a mock renderer for testing rendering without a real canvas.

### Test Matchers

```typescript
import { extendExpect } from '@djentronome/test-utils';

// Extend Jest or Vitest with custom matchers
extendExpect();

// Now you can use custom matchers in your tests
expect(vector).toBeVector2D({ x: 10, y: 20 });
expect(gameObject).toBeRenderedAt({ x: 100, y: 100 });
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