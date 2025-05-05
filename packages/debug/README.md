# Debug Package

Debugging tools and utilities for the Djentronome project.

## Features

- Debug overlays and visualizations
- Performance monitoring
- State inspection tools
- Error reporting

## Usage

```typescript
import { DebugOverlay, StateInspector } from '@djentronome/debug';

// Initialize debug overlay
const overlay = new DebugOverlay();
overlay.show();

// Display current state
const inspector = new StateInspector();
inspector.displayState(gameState);
```

## API

### `DebugOverlay`

A visual overlay for displaying debug information.

#### Methods

- `show()`: Show the debug overlay
- `hide()`: Hide the debug overlay
- `addMetric(name, value)`: Add a metric to the overlay

### `StateInspector`

A tool for inspecting game state.

#### Methods

- `displayState(state)`: Display the current state
- `watchState(state)`: Watch state for changes

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
