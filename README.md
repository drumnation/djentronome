# Djentronome

A monorepo game engine and application built with pnpm workspaces and Turborepo.

## 🧱 Monorepo Structure

| Path                    | Description                                  |
|-------------------------|----------------------------------------------|
| `apps/game-ui`          | Frontend game UI application                 |
| `apps/game-client`      | Game client application                      |
| `apps/game-server`      | Game server application                      |
| `packages/ai`           | AI utilities for game logic                  |
| `packages/animation`    | Animation system                             |
| `packages/assets`       | Game assets (sprites, sounds)                |
| `packages/camera`       | Camera utilities                             |
| `packages/collision`    | Collision detection system                   |
| `packages/controls`     | Game control system                          |
| `packages/core-audio`   | Core audio system                            |
| `packages/core-graphics`| Core graphics rendering                      |
| `packages/core-logic`   | Core game logic                              |
| `packages/debug`        | Debug utilities                              |
| `packages/ecs`          | Entity Component System                      |
| `packages/game-core`    | Game engine core systems                     |
| `packages/game-loop`    | Game loop implementation                     |
| `packages/game-state`   | Game state management                        |
| `packages/input`        | Input handling system                        |
| `packages/level`        | Level management system                      |
| `packages/performance`  | Performance monitoring tools                 |
| `packages/physics`      | Physics engine                               |
| `packages/save-system`  | Save/load system                             |
| `packages/sound`        | Sound system                                 |
| `packages/test-utils`   | Testing utilities                            |
| `packages/ui`           | UI components                                |
| `packages/utils`        | General utilities                            |
| `tooling/tsconfig`      | Shared TypeScript configurations             |
| `tooling/eslint-config` | Shared ESLint configurations                 |
| `tooling/prettier-config`| Shared Prettier configurations              |

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint
```

## 🧪 Testing

This project uses Vitest for unit and integration testing.

## 📚 Storybook

UI components can be developed and tested using Storybook:

```bash
# Start Storybook
cd apps/game-ui
pnpm storybook
``` 