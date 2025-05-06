# Project Directory Structure

This document outlines the structure of the `djentronome` monorepo, detailing the purpose of each top-level directory and key configuration files.

```txt
djentronome/
├── .brain/                           # Contains AI/assistant related files, notes, and configurations.
│   ├── 1-agent-tony-stark/           # Agent Tony Stark specific files and configurations.
│   │   ├── a-project/                # Project-related files for Agent Tony Stark.
│   │   ├── b-features/               # Feature-related files for Agent Tony Stark.
│   │   ├── c-bugs/                   # Bug-related files for Agent Tony Stark.
│   │   └── d-skill-jacks/            # Skill jacks for Agent Tony Stark.
│   ├── 2-agent-spock/                # Agent Spock specific files and configurations.
│   │   ├── a-project/                # Project-related files for Agent Spock.
│   │   └── d-skill-jacks/            # Skill jacks for Agent Spock.
│   ├── 3-agent-q/                    # Agent Q specific files and configurations.
│   │   ├── a-project/                # Project-related files for Agent Q.
│   │   └── d-skill-jacks/            # Skill jacks for Agent Q.
│   ├── prompts/                      # AI prompts for agents.
│   │   ├── analysis/                 # Analysis-related prompts.
│   │   ├── communication/            # Communication-related prompts.
│   │   ├── debugging/                # Debugging-related prompts.
│   │   ├── frontend/                 # Frontend-related prompts.
│   │   ├── git/                      # Git-related prompts.
│   │   ├── plan-generation/          # Plan generation prompts.
│   │   ├── quality/                  # Quality-related prompts.
│   │   ├── routine/                  # Routine task prompts.
│   │   ├── rules/                    # Rule-related prompts.
│   │   ├── skill-jacks/              # Skill jack prompts.
│   │   ├── stuck-agent/              # Prompts for handling stuck agents.
│   │   ├── testing/                  # Testing-related prompts.
│   │   ├── utilities/                # Utility prompts.
│   │   └── writing/                  # Writing-related prompts.
│   ├── skill-jacks/                  # Shared skill jacks used across agents.
│   │   └── testing/                  # Testing-related skill jacks.
│   ├── config.json                   # Configuration for the AI brain.
│   ├── directory-structure.md        # This file - outlines the project structure.
│   ├── project-overview.md           # Overview of the project.
│   └── project-plan.md               # Project plan and roadmap.
├── .cursor/                          # Cursor IDE specific settings and configurations.
│   └── rules/                        # Custom AI rules for Cursor.
├── .turbo/                           # Turborepo cache, logs, and internal files.
│   ├── cache/                        # Build cache managed by Turborepo.
│   ├── cookies/                      # Turborepo internal cookie files.
│   └── daemon/                       # Turborepo daemon files.
├── .vscode/                          # VS Code editor settings and configurations.
├── apps/                             # Contains runnable applications built using shared packages.
│   └── game-ui/                      # Dedicated UI application (e.g., menus, HUD, admin interfaces).
│       ├── public/                   # Static assets served by the UI application.
│       └── src/                      # Source code for the game UI application.
│           ├── assets/               # UI-specific assets.
│           ├── components/           # Reusable UI components for this app.
│           │   ├── common/           # Common reusable components.
│           │   └── layout/           # Layout components.
│           ├── routes/               # Application routes.
│           ├── screens/              # Screen components.
│           ├── store/                # State management for the UI.
│           ├── test/                 # Tests for the game UI application.
│           └── theme/                # Theming for the UI application.
├── docs/                             # Project documentation.
│   └── features/                     # Feature-specific documentation.
│       └── basic-ui-shell/           # Documentation for the basic UI shell.
├── packages/                         # Reusable code libraries (packages) shared across applications or other packages.
│   ├── assets/                       # Shared game assets used across multiple packages/apps.
│   │   ├── sounds/                   # Audio sound effect files.
│   │   ├── sprites/                  # Image sprite files.
│   │   ├── src/                      # Source code for the assets package.
│   │   │   └── types/                # TypeScript type definitions for assets.
│   │   └── testing/                  # Testing for assets.
│   ├── controls/                     # Input handling and player control mapping.
│   │   └── src/                      # Source code for controls package.
│   ├── core-audio/                   # Low-level audio engine integration or handling.
│   │   └── src/                      # Source code for core-audio package.
│   │       ├── test/                 # Tests for core-audio.
│   │       └── types/                # TypeScript type definitions for core-audio.
│   ├── core-graphics/                # Low-level graphics rendering engine integration or utilities.
│   │   ├── src/                      # Source code for core-graphics package.
│   │   │   └── types/                # TypeScript type definitions for core-graphics.
│   │   └── testing/                  # Testing for core-graphics.
│   │       └── integration/          # Integration tests for core-graphics.
│   ├── core-logic/                   # Core game logic, fundamental rules, or state machines.
│   │   ├── src/                      # Source code for core-logic package.
│   │   │   └── types/                # TypeScript type definitions for core-logic.
│   │   └── testing/                  # Testing for core-logic.
│   │       └── integration/          # Integration tests for core-logic.
│   ├── debug/                        # Debugging tools, overlays, and utilities.
│   │   ├── src/                      # Source code for debug package.
│   │   │   └── types/                # TypeScript type definitions for debug.
│   │   └── testing/                  # Testing for debug.
│   │       └── integration/          # Integration tests for debug.
│   ├── ecs/                          # Entity Component System (ECS) implementation.
│   │   ├── docs/                     # ECS documentation.
│   │   ├── src/                      # Source code for ECS package.
│   │   │   └── types/                # TypeScript type definitions for ECS.
│   │   └── testing/                  # Testing for ECS.
│   │       └── integration/          # Integration tests for ECS.
│   ├── game-core/                    # Central game engine components, orchestrator, or setup.
│   │   ├── src/                      # Source code for game-core package.
│   │   │   └── types/                # TypeScript type definitions for game-core.
│   │   └── testing/                  # Testing for game-core.
│   │       ├── e2e/                  # End-to-end tests for game-core.
│   │       └── integration/          # Integration tests for game-core.
│   ├── game-loop/                    # Main game loop implementation (e.g., update, render cycles).
│   │   ├── src/                      # Source code for game-loop package.
│   │   │   └── types/                # TypeScript type definitions for game-loop.
│   │   └── testing/                  # Testing for game-loop.
│   │       ├── e2e/                  # End-to-end tests for game-loop.
│   │       └── integration/          # Integration tests for game-loop.
│   ├── game-state/                   # Global game state management (potentially using Zustand).
│   │   ├── src/                      # Source code for game-state package.
│   │   │   └── types/                # TypeScript type definitions for game-state.
│   │   └── testing/                  # Testing for game-state.
│   │       ├── e2e/                  # End-to-end tests for game-state.
│   │       └── integration/          # Integration tests for game-state.
│   ├── input/                        # Input event processing and abstraction layer.
│   │   ├── src/                      # Source code for input package.
│   │   │   └── types/                # TypeScript type definitions for input.
│   │   └── testing/                  # Testing for input.
│   │       ├── e2e/                  # End-to-end tests for input.
│   │       └── integration/          # Integration tests for input.
│   ├── sound/                        # Higher-level sound management, effects playback, and music handling.
│   │   └── src/                      # Source code for sound package.
│   │       └── types/                # TypeScript type definitions for sound.
│   ├── test-utils/                   # Utilities specifically designed for helping write tests.
│   │   ├── src/                      # Source code for test-utils package.
│   │   │   └── types/                # TypeScript type definitions for test-utils.
│   │   └── testing/                  # Testing for test-utils.
│   │       └── integration/          # Integration tests for test-utils.
│   ├── ui/                           # Shared, reusable UI components (e.g., buttons, menus) used across apps.
│   │   └── src/                      # Source code for ui package.
│   └── utils/                        # General utility functions and helpers.
│       └── src/                      # Source code for utils package.
│           └── types/                # TypeScript type definitions for utils.
├── scripts/                          # Utility scripts for development, build, or deployment processes.
│   └── agents/                       # Scripts related to AI agents.
├── test-assets/                      # Assets specifically used during testing phases.
│   └── sound/                        # Sound assets for testing.
├── tooling/                          # Shared development tooling configurations and packages.
│   ├── eslint/                       # Shared ESLint configuration for code linting.
│   ├── prettier/                     # Shared Prettier configuration for code formatting.
│   ├── testing/                      # Testing configurations and tools.
│   │   └── src/                      # Source code for testing tools.
│   │       ├── e2e/                  # End-to-end testing tools.
│   │       ├── integration/          # Integration testing tools.
│   │       ├── playwright/           # Playwright configuration and tools.
│   │       ├── playwright-backend/   # Playwright backend configuration and tools.
│   │       ├── types/                # TypeScript type definitions for testing.
│   │       └── unit/                 # Unit testing tools.
│   └── typescript/                   # Shared TypeScript configurations.
│       └── base/                     # Base TypeScript configuration.
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
├── tsconfig.tsbuildinfo              # TypeScript build information file.
└── turbo.json                        # Turborepo configuration file, defining build pipelines and task dependencies.
```
