# Core Logic Package

Core logic implementation for the Djentronome project.

## Features

- Game rules and mechanics
- System interactions
- Core game functionality

## Usage

```typescript
import { GameRules } from '@djentronome/core-logic';

// Example usage of game rules
const rules = new GameRules();
const isValidMove = rules.validateMove(moveData);

// More examples to be added as the package is developed
```

## API

### `GameRules`

The main class that handles the game rules.

#### Methods

- `validateMove(moveData)`: Validates if a move is legal according to the game rules
- Additional methods to be added as the package is developed

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