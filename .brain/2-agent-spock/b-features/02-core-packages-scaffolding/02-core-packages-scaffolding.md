# Feature Task Plan

## Feature: Core Packages Scaffolding

## Task: Setup and structure core packages for the rhythm game

## Status: ✅ Completed

## Last Updated: 2025-05-05

## Related Documentation:
- Feature Index: ../../../../docs/features/core-packages-scaffolding/core-packages-scaffolding.index.md
- Technical Details Doc: ../../../../docs/features/core-packages-scaffolding/technical-details.md

## 1. Overview

This task involves setting up the core packages required for the Djentronome rhythm game project. These packages will provide the foundational structure and functionality needed for other features, including Web MIDI integration, pattern loading, game loops, hit detection, and scoring. The goal is to create properly structured packages with clear responsibilities, following the monorepo architecture with pnpm workspaces and Turborepo.

## 2. Codebase Analysis

### 2.1. Key Files & Modules

* `package.json`: Root package definition for the monorepo
* `pnpm-workspace.yaml`: Workspace configuration for the monorepo
* `turbo.json`: Turborepo configuration for task orchestration
* `packages/README.md`: Documentation for the packages directory
* `packages/*/`: Existing package directories
* `.brain/2-agent-spock/d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts`: Skill jack for monorepo tooling

### 2.2. Dependencies

* `pnpm`: Package manager for the monorepo
* `turborepo`: Task runner and build system
* `typescript`: Programming language
* `vitest`: Testing framework for unit and integration tests
* `@kit/testing`: Shared testing utilities
* `@kit/tsconfig`: Shared TypeScript configuration
* `@kit/eslint-config`: Shared ESLint configuration
* `@kit/prettier-config`: Shared Prettier configuration

### 2.3. Potential Concerns

* Ensuring the right dependencies between packages to avoid circular dependencies
* [x] Mark as addressed
* Making sure package exports are correctly defined for TypeScript imports
* [x] Mark as addressed
* Establishing consistent patterns across packages for testing and documentation
* [x] Mark as addressed

## 3. Architectural Considerations

### 3.1. Selected Paradigm

* Monorepo Architecture with Micropackages - Each package has a focused responsibility with clear boundaries
* [x] Confirmed with the user

### 3.2. Selected Design Patterns

* Module Pattern - Each package exports a clear API through its index.ts file
* [x] Confirmed with the user
* Dependency Injection - Systems will accept dependencies through constructor/parameters rather than importing directly
* [x] Confirmed with the user
* Entity-Component-System (ECS) - For game object management in core packages
* [x] Confirmed with the user

### 3.3. Architectural Considerations & Rationale

* The monorepo approach with micro-packages allows for better separation of concerns while enabling code sharing across the project. Each package will have a specific focus (e.g., audio handling, input processing, game state) which improves maintainability and testing.
* Using the module pattern with explicit exports ensures a clean public API for each package, hiding implementation details.
* Dependency injection improves testability by allowing mock dependencies in tests.
* The ECS pattern is well-suited for game development as it separates entities (game objects) from their data (components) and behavior (systems).
* [x] Confirmed with the user

## 4. Project Task List Foresight

### 4.1. Downstream Impacts

* The core packages will be used by almost all future features, so their design and API will impact the entire project.
* The decision on how to structure audio, input, and game state packages will affect the implementation of MIDI integration (F4).
* The game loop and pattern loading implementation will directly impact hit detection and scoring (F8).
* [x] Reviewed and confirmed no negative impacts

### 4.2. Future-Proofing Considerations

* Design packages with extension points for future features
* Create clear, documented APIs that won't need to change frequently
* Keep packages focused to minimize the impact of future changes
* Design with testability in mind to ensure future modifications don't break existing functionality
* [x] Discussed with the user and incorporated feedback

## 5. Testing Strategy

### 5.1. Available Testing Options

* `[x] Unit Tests`
    * Location: `packages/[package-name]/src/test/`
    * Command to run all tests: `turbo run test`
    * Command to run a single test: `pnpm --filter @kit/[package-name] test:unit -- -t "test name"`
    * Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`

* `[x] Integration Tests`
    * Location: `packages/[package-name]/testing/integration/`
    * Command to run all tests: `turbo run test:integration`
    * Command to run a single test: `pnpm --filter @kit/[package-name] test:integration -- -t "test name"`
    * Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`

* `[x] End-to-End (E2E) Tests`
    * Location: `packages/[package-name]/testing/e2e/`
    * Command to run all tests: `turbo run test:e2e`
    * Command to run a single test: `pnpm --filter @kit/[package-name] test:e2e -- -t "test name"`
    * Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`

### 5.2. Selected Testing Approach

* We will focus on unit tests for individual functions and methods within each package.
* Integration tests will be used to verify interactions between packages and components.
* E2E tests will be minimal at this stage since we're focusing on foundational packages.
* Testing will follow a Test-Driven Development (TDD) approach, writing tests before implementing features.
* [x] Confirmed testing approach aligns with project standards.

## 6. MECE Task Breakdown & TDD Plan

### 6.1. Subtask 1: Review and analyze existing packages

* `[x]` Task completed.
* `[x]` Analyze existing package structure to understand patterns and conventions
* `[x]` Identify gaps and missing core packages needed for the rhythm game
* `[x]` Review package dependencies and relationships
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts`
* Testing Type: N/A (Analysis task)

#### Analysis Notes:
- Each package follows a consistent structure with:
  - `src/` directory containing source code
  - `src/types/` for TypeScript types and interfaces
  - `src/index.ts` as the main entry point
  - `testing/` directory for tests
  - `package.json` with script definitions and dependencies
  - `tsconfig.json` extending from `@kit/tsconfig/base`
  - `README.md` with usage information and API docs
- There are already 15 packages in the monorepo but we need to create:
  - `core-midi` for Web MIDI device integration
  - `pattern-loader` for rhythm pattern handling
  - `rhythm-engine` for game mechanics like hit detection and scoring
  - `latency-calibration` for input timing adjustments
- Package dependencies follow a unidirectional pattern with lower-level packages (e.g., utils) being used by higher-level ones
- Each package has consistent scripts for testing, linting, and type checking
- All packages use the `@djentronome` namespace
- Existing packages use vitest for unit, integration, and e2e testing

### 6.2. Subtask 2: Define package specifications

* `[x]` Task completed.
* `[x]` Define clear responsibilities and boundaries for each core package
* `[x]` Document package interfaces and expected behaviors
* `[x]` Plan package dependencies and relationships
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts`
* Testing Type: N/A (Design task)

#### Package Specifications:

1. **core-midi Package**
   - Purpose: Manage Web MIDI device connections and handle MIDI messages
   - Key interfaces: `MIDIHandler`, `MIDIMessage`, `MIDIDevice`
   - Dependencies: No internal dependencies
   - Used by: input, rhythm-engine

2. **pattern-loader Package**
   - Purpose: Load, parse and manage rhythm patterns for the game
   - Key interfaces: `PatternLoader`, `Pattern`, `Note`
   - Dependencies: utils
   - Used by: rhythm-engine, game-state

3. **rhythm-engine Package**
   - Purpose: Core gameplay mechanics including hit detection and scoring
   - Key interfaces: `RhythmEngine`, `HitResult`, `ScoreCalculator`
   - Dependencies: core-midi, pattern-loader, game-loop, utils
   - Used by: game-state, game-core

4. **latency-calibration Package**
   - Purpose: Measure and compensate for input latency
   - Key interfaces: `LatencyCalibrator`, `LatencyTest`, utility functions
   - Dependencies: core-audio, core-midi, utils
   - Used by: rhythm-engine, input

More detailed specifications and rationale are documented in the [technical details document](../../../../docs/features/core-packages-scaffolding/technical-details.md).

### 6.3. Subtask 3: Implement core-midi package

* `[x]` Task completed.
* `[x]` Write tests for MIDI message handling and device connection
* `[x]` Implement MIDI connection and message handling
* `[x]` Document package API and usage
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/web-midi-integration.skill-jack.ts`
* Testing Type: Unit Tests

#### Implementation Notes:
- Created core-midi package with necessary files:
  - package.json, tsconfig.json
  - src/types/index.ts: Contains MIDI message and connection types
  - src/midi-handler.ts: Main MIDIHandler class implementation
  - src/web-midi.d.ts: TypeScript definitions for Web MIDI API
  - src/index.ts: Exports for the package
  - src/midi-handler.unit.test.ts: Unit tests for MIDIHandler
  - README.md: Usage documentation
- Implemented the MIDIHandler class with:
  - MIDI device connection management
  - Message parsing for different MIDI event types
  - Event callback system
  - Focus on support for Alesis Nitro drum kit

### 6.4. Subtask 4: Implement pattern-loader package

* `[x]` Task completed.
* `[x]` Write tests for pattern loading and parsing
* `[x]` Implement pattern format and loading functionality
* `[x]` Document pattern format and loader API
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/data-structures-game-patterns.skill-jack.ts`
* Testing Type: Unit Tests

#### Implementation Notes:
- Created pattern-loader package with necessary files:
  - package.json, tsconfig.json
  - src/types/index.ts: Contains pattern data structures and types
  - src/pattern-loader.ts: Main PatternLoader class implementation
  - src/index.ts: Exports for the package
  - src/pattern-loader.unit.test.ts: Unit tests for PatternLoader
  - src/test/sample-pattern.json: Sample pattern file for testing
  - README.md: Usage documentation
- Implemented the PatternLoader class with:
  - Pattern loading from JSON files
  - Pattern validation to ensure required fields
  - Support for pattern sections (intro, verse, chorus)
  - Type-safe pattern handling with comprehensive TypeScript types

### 6.5. Subtask 5: Implement rhythm-engine package

* `[x]` Task completed.
* `[x]` Write tests for note timing, hit detection, and scoring
* `[x]` Implement core rhythm game mechanics
* `[x]` Document rhythm engine API and integration
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/rhythm-game-scoring.skill-jack.ts`
* Testing Type: Unit Tests and Integration Tests

#### Implementation Notes:
- Created rhythm-engine package with necessary files:
  - package.json, tsconfig.json
  - src/types/index.ts: Contains comprehensive types for hit detection, scoring, and game state
  - src/rhythm-engine.ts: Main RhythmEngine class implementation
  - src/index.ts: Exports for the package
  - src/rhythm-engine.unit.test.ts: Unit tests for RhythmEngine
  - README.md: Usage documentation
- Implemented RhythmEngine class with:
  - Hit detection with configurable timing windows
  - Scoring system with combo multipliers
  - Game state management (play, pause, stop)
  - Event-based architecture for gameplay events
  - Latency compensation for input devices
  - Automatic handling of missed notes
  - Comprehensive stats tracking

### 6.6. Subtask 6: Implement latency-calibration package

* `[x]` Task completed.
* `[x]` Write tests for latency measurement and compensation
* `[x]` Implement latency calibration functionality
* `[x]` Document latency calibration API and usage
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/latency-compensation.skill-jack.ts`
* Testing Type: Unit Tests

#### Implementation Notes:
- Implemented latency-calibration package with necessary files:
  - package.json with dependencies on core-audio and core-midi
  - tsconfig.json extending from @kit/tsconfig/base
  - src/ directory with implementation files
  - tests with Vitest configuration
  - README.md with comprehensive documentation
- Implemented LatencyCalibrator class with:
  - Visual sync test (flashing + tap)
  - Audio sync test (sound + tap)
  - MIDI sync test (sound + MIDI input)
  - Persistent storage of calibration results
  - Configuration options for test parameters
  - Multiple test types for statistical accuracy
- Integrated with core-midi and core-audio packages
- Designed API to be easily usable by other packages (particularly rhythm-engine)

### 6.7. Subtask 7: Integration testing between packages

* `[x]` Task completed.
* `[x]` Write integration tests for package interactions
* `[x]` Verify packages work together as expected
* `[x]` Document integration patterns and examples
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/tdd-vitest.skill-jack.ts`
* Testing Type: Integration Tests

#### Implementation Notes:
- Created integration tests between all core packages:
  - rhythm-engine + pattern-loader: Testing pattern loading and processing
  - core-midi + rhythm-engine: Testing MIDI input handling in gameplay
  - latency-calibration + rhythm-engine: Testing latency offset application
- Set up proper test infrastructure in each package's `testing/integration` directory
- Used vitest for running integration tests
- Implemented test utilities for mocking and verification
- Focused on testing realistic usage scenarios combining multiple packages
- Used dependency injection to facilitate testing with mocks

### 6.8. Subtask 8: Update documentation

* `[x]` Task completed.
* `[x]` Update each package's README.md
* `[x]` Update technical documentation in docs/features/core-packages-scaffolding/
* `[x]` Update packages/README.md with new packages
* Relevant Skill Jacks: `Read @.brain/2-agent-spock/d-skill-jacks/monorepo-tooling-pnpm-turbo.skill-jack.ts`
* Testing Type: N/A (Documentation task)

#### Implementation Notes:
- Updated packages/README.md to include all new packages with their descriptions and responsibilities
- Updated technical details document at docs/features/core-packages-scaffolding/technical-details.md
- Added comprehensive usage examples to each package's README.md
- Documented integration patterns between packages
- Added API documentation for all exported components and functions
- Included setup and installation instructions for each package
- Added cross-links between related documentation

## 7. Current Project Status

### 7.1. Completed Tasks
- Review and analyze existing packages
- Define package specifications
- Implement core-midi package with MIDI device connection and message handling
- Implement pattern-loader package with pattern loading and validation
- Implement rhythm-engine package with hit detection and scoring functionality
- Implement latency-calibration package with sync tests and offset calibration
- Create integration tests between packages
- Complete documentation updates

### 7.2. Next Steps
- Begin implementation of Web MIDI integration feature using the core-midi package
- Start work on gameplay implementation using the rhythm-engine and pattern-loader packages
- Integrate latency calibration into the main game flow

### 7.3. Progress Metrics
- 8/8 subtasks completed (100%)
- 4/4 packages fully implemented (100%)
- Core gameplay mechanics ready for integration
- All integration tests and documentation completed 