# Djentronome

A monorepo game engine and application built with pnpm workspaces and Turborepo.

## 🧱 Monorepo Structure

| Path                    | Description                                  |
|-------------------------|----------------------------------------------|
| `apps/game-ui`          | Frontend game UI application                 |
| `apps/game-client`      | Game client application                      |
| `apps/game-server`      | Game server application                      |
| `packages/assets`       | Game assets (sprites, sounds)                |
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
| `packages/sound`        | Sound system                                 |
| `packages/test-utils`   | Testing utilities                            |
| `packages/ui`           | UI components                                |
| `packages/utils`        | General utilities                            |
| `tooling/eslint`        | Shared ESLint configurations                 |
| `tooling/prettier`      | Shared Prettier configurations               |
| `tooling/testing`       | Testing utilities and configurations         |
| `tooling/typescript`    | Shared TypeScript configurations             |

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

## 🧠 Multi-Agent Development

This project is configured for development using specialized AI agents (Tony Stark, Spock, Q), each with their own set of rules and skill-jacks stored in the `.brain/` directory.

To switch the active agent context for AI tools (like Cursor), use the `change-agent` script:

```bash
# Switch to Agent Tony Stark (Frontend)
pnpm change-agent 1-agent-tony-stark

# Switch to Agent Spock (Core Systems)
pnpm change-agent 2-agent-spock

# Switch to Agent Q (Audio/Transcription)
pnpm change-agent 3-agent-q
```

This command updates the `.brain/config.json` and merges the selected agent's specific rules from `.brain/[agent-id]/.cursorrules` into the root `.cursorrules` file, making their context active. 