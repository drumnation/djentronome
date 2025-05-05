# Project Directory Structure

This document outlines the structure of the `djentronome` monorepo, detailing the purpose of each top-level directory and key configuration files.

```txt
djentronome/
├── .brain/                           # Contains AI/assistant related files, notes, and configurations.
│   └── directory-structure.md        # This file - outlines the project structure.
├── .cursor/                          # Cursor IDE specific settings and configurations.
│   └── rules/                        # Custom AI rules for Cursor.
├── .turbo/                           # Turborepo cache, logs, and internal files.
│   ├── cache/                        # Build cache managed by Turborepo.
│   ├── cookies/                      # Turborepo internal cookie files.
│   └── daemon/                       # Turborepo daemon files.
├── .vscode/                          # VS Code editor settings and configurations.
├── apps/                             # Contains runnable applications built using shared packages.
│   ├── game-client/                  # Client-side application (e.g., web-based game interface).
│   │   └── src/                      # Source code for the game client.
│   ├── game-server/                  # Server-side application for the game logic and multiplayer.
│   │   └── src/                      # Source code for the game server.
│   └── game-ui/                      # Dedicated UI application (e.g., menus, HUD, admin interfaces).
│       ├── .turbo/                   # Turborepo cache specific to game-ui.
│       ├── public/                   # Static assets served by the UI application.
│       └── src/                      # Source code for the game UI application.
│           ├── assets/               # UI-specific assets.
│           ├── components/           # Reusable UI components for this app.
│           └── test/                 # Tests for the game UI application.
├── packages/                         # Reusable code libraries (packages) shared across applications or other packages.
│   ├── ai/                           # Artificial intelligence logic (e.g., enemy behavior, pathfinding).
│   ├── animation/                    # Animation system, components, or utilities.
│   ├── assets/                       # Shared game assets used across multiple packages/apps.
│   │   ├── sounds/                   # Audio sound effect files.
│   │   └── sprites/                  # Image sprite files.
│   ├── camera/                       # Camera control logic (e.g., follow, zoom, pan).
│   ├── collision/                    # Collision detection system and logic.
│   ├── controls/                     # Input handling and player control mapping.
│   │   └── src/                      # Source code for controls package.
│   ├── core-audio/                   # Low-level audio engine integration or handling.
│   │   └── src/                      # Source code for core-audio package.
│   ├── core-graphics/                # Low-level graphics rendering engine integration or utilities.
│   │   └── src/                      # Source code for core-graphics package.
│   ├── core-logic/                   # Core game logic, fundamental rules, or state machines.
│   │   ├── .turbo/                   # Turborepo cache specific to core-logic.
│   │   └── src/                      # Source code for core-logic package.
│   ├── debug/                        # Debugging tools, overlays, and utilities.
│   │   └── src/                      # Source code for debug package.
│   ├── ecs/                          # Entity Component System (ECS) implementation.
│   ├── game-core/                    # Central game engine components, orchestrator, or setup.
│   ├── game-loop/                    # Main game loop implementation (e.g., update, render cycles).
│   ├── game-state/                   # Global game state management (potentially using Zustand).
│   │   └── src/                      # Source code for game-state package.
│   ├── input/                        # Input event processing and abstraction layer.
│   │   ├── .turbo/                   # Turborepo cache specific to input.
│   │   └── src/                      # Source code for input package.
│   ├── level/                        # Level data format, loading, and management logic.
│   ├── performance/                  # Performance monitoring and optimization tools/utilities.
│   ├── physics/                      # Physics engine integration or simulation logic.
│   ├── save-system/                  # Game save and load functionality.
│   ├── sound/                        # Higher-level sound management, effects playback, and music handling.
│   ├── test-utils/                   # Utilities specifically designed for helping write tests.
│   │   └── src/                      # Source code for test-utils package.
│   ├── testing/                      # General testing framework setup or configurations.
│   ├── ui/                           # Shared, reusable UI components (e.g., buttons, menus) used across apps.
│   │   └── src/                      # Source code for ui package.
│   └── utils/                        # General utility functions and helpers.
├── scripts/                          # Utility scripts for development, build, or deployment processes.
├── test-assets/                      # Assets specifically used during testing phases.
│   └── sound/                        # Sound assets for testing.
├── tooling/                          # Shared development tooling configurations and packages.
│   ├── eslint-config/                # Shared ESLint configuration for code linting.
│   ├── prettier-config/              # Shared Prettier configuration for code formatting.
│   └── tsconfig/                     # Shared TypeScript base configurations.
├── .cursorignore                     # Specifies files and directories for the Cursor IDE to ignore.
├── .cursorrules                      # Main configuration file for custom Cursor AI rules.
├── .gitignore                        # Specifies files and directories for Git version control to ignore.
├── .markdownlint-cli2.jsonc          # Configuration for the Markdownlint CLI tool (JSONC format).
├── .markdownlint.yaml                # Configuration for Markdownlint (YAML format).
├── package.json                      # Root Node.js project manifest file, manages workspaces, root dependencies, and scripts.
├── pnpm-lock.yaml                    # PNPM lock file, ensuring deterministic dependency installation.
├── pnpm-workspace.yaml               # Defines the PNPM workspaces (apps and packages).
├── README.md                         # Root project README file with overview, setup, and usage instructions.
├── tsconfig.json                     # Root TypeScript configuration, often extending a base config from tooling/.
└── turbo.json                        # Turborepo configuration file, defining build pipelines and task dependencies.
```
