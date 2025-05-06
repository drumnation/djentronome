
# Packages Directory

This directory contains all shared libraries and modules used throughout the Djentronome project. Each package follows a consistent structure and is published internally using workspace dependencies.

## Package Structure

All packages follow this standard structure:
```txt
packages/[package-name]/
├── src/             # Source code
│   ├── types/       # TypeScript types and interfaces
│   └── index.ts     # Main entry point
├── testing/         # Tests by category
│   ├── e2e/         # End-to-end tests (if applicable)
│   └── integration/ # Integration tests
├── docs/            # Package-specific documentation
├── tsconfig.json    # TypeScript configuration
├── package.json     # Package manifest
└── README.md        # Package documentation
```

## Creating a New Package

When creating a new package:

1. Follow the naming convention: `@djentronome/[package-name]`
2. Use workspace dependencies with `"workspace:*"` version
3. Add proper exports in package.json
4. Include the appropriate test scripts
5. Make sure to update this README to document the package

## Available Packages

| Package | Description | Primary Purpose |
|---------|-------------|-----------------|
| `assets` | Game assets including sounds and sprites | Shared media resources |
| `controls` | UI controls and input handling components | User control systems |
| `core-audio` | Audio processing foundations | Handling audio playback and processing |
| `core-graphics` | Graphics processing foundations | Rendering and visual systems |
| `core-logic` | Core game logic and rules | Gameplay mechanics |
| `debug` | Debugging utilities | Development tools |
| `ecs` | Entity Component System | Game architecture |
| `game-core` | Central game mechanics | Core gameplay elements |
| `game-loop` | Game loop implementation | Animation and update cycle |
| `game-state` | State management for game | Global and local state |
| `input` | Input handling systems | Controllers, MIDI, keyboard |
| `sound` | Sound effects and music | Audio playback |
| `test-utils` | Testing utilities | Test helpers |
| `ui` | UI component library | Reusable UI elements |
| `utils` | General utilities | Shared helper functions |

## Package Responsibilities

### Core Technology Packages
- **core-audio**: Audio processing, Web Audio API integration, timing synchronization
- **core-graphics**: Rendering foundations, canvas management
- **core-logic**: Game rules, scoring mechanics, difficulty handling

### Gameplay Packages
- **game-core**: Central gameplay mechanics, note handling, gameplay rules
- **game-loop**: Animation loop, frame timing, performance optimization
- **game-state**: State management (using Zustand), gameplay progression
- **ecs**: Entity Component System for managing game objects

### I/O Packages
- **input**: MIDI integration for Alesis Nitro, keyboard controls, input mapping
- **sound**: Sound effects, music playback, audio feedback
- **controls**: UI control components, settings interfaces

### UI Packages
- **ui**: Shared UI components using Mantine
- **assets**: Sprites, sounds, and other media resources

### Development Packages
- **debug**: Development tools, performance monitors, state visualizers
- **test-utils**: Testing utilities, mock data, test helpers
- **utils**: Shared utilities for common tasks

## When to Create a New Package vs. Add to Existing

- Create a new package when:
  - The functionality has a clear, distinct responsibility
  - It could potentially be used across multiple apps
  - It has minimal dependencies on other packages
  
- Add to an existing package when:
  - The functionality extends current package capabilities
  - It shares the same domain/responsibility
  - It has strong coupling with existing code

## Dependencies Between Packages

- Keep dependencies unidirectional when possible
- Core packages should have minimal dependencies
- Higher-level packages can depend on lower-level ones
- Avoid circular dependencies between packages

## For More Information

See the [monorepo documentation](../../docs/monorepo.md) for more details on workspace structure and package management.
