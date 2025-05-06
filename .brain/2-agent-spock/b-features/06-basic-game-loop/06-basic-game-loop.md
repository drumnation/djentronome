# Feature Task Plan

## Feature: Basic Game Loop

## Task: Implement core game loop with timing and synchronization

## Status: 🔄 In Progress

## Last Updated: 2025-05-06

## Related Documentation:
- Feature Index: ../../../../docs/features/basic-game-loop/basic-game-loop.index.md
- Technical Details Doc: ../../../../docs/features/basic-game-loop/technical-details.md

## 1. Overview

This task involves implementing a robust game loop system that will serve as the foundation for the rhythm game's timing and synchronization. The game loop will manage the game's frame rate, handle timing for pattern playback, and ensure consistent performance across different devices. It will need to integrate with both the pattern loader and audio systems to ensure accurate rhythm gameplay.

## 2. Codebase Analysis

### 2.1. Key Files & Modules

* `packages/game-loop/src/index.ts`: Currently contains a basic game loop implementation with render and update callbacks.
* `packages/game-loop/src/game-loop.unit.test.ts`: Contains unit tests for the basic game loop functionality.
* `packages/game-loop/src/types/index.ts`: Exports types for the game loop module.
* `packages/pattern-loader/src/index.ts`: Provides functionality for loading rhythm patterns.
* `packages/pattern-loader/src/pattern-loader.ts`: Handles loading and parsing rhythm pattern data.
* `packages/core-audio/src/index.ts`: Contains the audio engine implementation for sound playback.

### 2.2. Dependencies

* `@djentronome/pattern-loader`: Required for loading and processing rhythm patterns.
* `@djentronome/core-audio`: Needed for audio playback and timing.
* `@djentronome/game-state`: Will be needed for managing game state (currently not integrated).
* `vitest`: Used for unit and integration testing.

### 2.3. Potential Concerns

* Timing accuracy: The game loop must maintain precise timing for rhythm game mechanics.
* Performance: Must optimize for consistent frame rates across different devices.
* Audio synchronization: Ensuring game loop timing aligns with audio playback.
* Latency handling: Need to account for input and audio latency.
* [ ] Mark as addressed

## 3. Architectural Considerations

### 3.1. Selected Paradigm

* Entity-Component-System (ECS) - A composition-based approach that separates data from behavior, allowing for flexible game object management and efficient updates.
* [ ] Confirmed with the user

### 3.2. Selected Design Patterns

* Observer Pattern - Used for event-based communication between game loop and other systems (audio, input, UI).
* [ ] Confirmed with the user
* Time Provider Pattern - Centralizes game time management and provides consistent timing for all subsystems.
* [ ] Confirmed with the user

### 3.3. Architectural Considerations & Rationale

* ECS architecture provides clear separation of concerns and modularity, which is ideal for a rhythm game where we need to handle multiple aspects (audio, input, visuals, scoring) efficiently. It allows us to:
  * Update only the necessary components each frame
  * Add new features without significant architectural changes
  * Optimize performance by batching similar operations
  
* The Observer Pattern decouples the game loop from other systems, allowing them to react to game loop events without tight coupling.

* The Time Provider Pattern ensures consistent timing throughout the application, which is crucial for a rhythm game where precise timing is essential.

* The game loop should be fixed-timestep with interpolation to ensure consistent gameplay regardless of device performance.

* [ ] Confirmed with the user

## 4. Project Task List Foresight

### 4.1. Downstream Impacts

* The game loop implementation will directly impact F8 (Hit Detection & Basic Scoring) as scoring depends on precise timing.
* F12 (Latency Calibration Tool) will need to integrate with the game loop for timing adjustments.
* Will establish patterns for how F6, F8, and F12 interact with each other.
* [ ] Reviewed and confirmed no negative impacts

### 4.2. Future-Proofing Considerations

* Design the game loop to be configurable for different modes (practice, performance, calibration).
* Implement hooks for future features like replays or analytics.
* Ensure the game loop can scale with increasing pattern complexity.
* Structure the loop to allow for future threading optimizations if needed.
* [ ] Discussed with the user and incorporated feedback

## 5. Testing Strategy

### 5.1. Available Testing Options

* `[x] Unit Tests`
  * Location: `packages/game-loop/src/*.unit.test.ts`
  * Command to run all tests: `pnpm test`
  * Command to run a single test: `pnpm test:unit`
  * Relevant Skill Jacks: None found specifically for unit testing

* `[x] Integration Tests`
  * Location: `packages/game-loop/testing/integration/*.integration.test.ts`
  * Command to run all tests: `pnpm test`
  * Command to run a single test: `pnpm test:integration`
  * Relevant Skill Jacks: None found specifically for integration testing

* `[x] End-to-End (E2E) Tests`
  * Location: `packages/game-loop/testing/e2e/*.e2e.test.ts`
  * Command to run all tests: `pnpm test`
  * Command to run a single test: `pnpm test:e2e`
  * Relevant Skill Jacks: None found specifically for E2E testing

### 5.2. Selected Testing Approach

* We will primarily focus on unit and integration tests for the game loop implementation.
* Unit tests will validate individual components like time management, frame calculation, and event dispatching.
* Integration tests will verify interactions between the game loop and other systems (pattern loader, audio engine).
* E2E tests will be minimal but should ensure the game loop performs correctly in a full application context.
* [ ] Confirmed testing approach aligns with project standards.

## 6. MECE Task Breakdown & TDD Plan

### 6.1. Subtask 1: Enhance GameLoop with Fixed Timestep Implementation
* `[x]` Task completed.
* `[x]` Test cases:
  * Should update at a consistent rate regardless of render fps
  * Should accumulate leftover time between frames
  * Should handle variable frame rates without impacting game logic
  * Should provide interpolation factor for rendering
* `[ ]` Test cases reviewed and approved.
* Testing Type: Unit

### 6.2. Subtask 2: Implement Time Provider Service
* `[x]` Task completed.
* `[x]` Test cases:
  * Should provide consistent game time
  * Should handle pausing and resuming
  * Should provide time scaling (slow motion, speed up)
  * Should allow time queries from any component
* `[ ]` Test cases reviewed and approved.
* Testing Type: Unit

### 6.3. Subtask 3: Develop Observer/Event System for Game Loop
* `[x]` Task completed.
* `[x]` Test cases:
  * Should notify subscribers when loop starts/stops
  * Should emit update and render events properly
  * Should allow subscriptions to specific events
  * Should handle error cases gracefully
* `[ ]` Test cases reviewed and approved.
* Testing Type: Unit

### 6.4. Subtask 4: Integrate Game Loop with Pattern Loader
* `[x]` Task completed.
* `[x]` Test cases:
  * Should sync pattern playback with game time
  * Should correctly trigger pattern events based on timing
  * Should handle pattern loading and unloading during gameplay
  * Should maintain timing precision across different patterns
* `[ ]` Test cases reviewed and approved.
* Testing Type: Integration

### 6.5. Subtask 5: Integrate Game Loop with Audio Engine
* `[ ]` Task completed.
* `[ ]` Test cases:
  * Should synchronize audio playback with game time
  * Should handle audio events in time with the game loop
  * Should adjust audio timing when game is paused/resumed
  * Should handle latency between visual and audio cues
* `[ ]` Test cases reviewed and approved.
* Testing Type: Integration

### 6.6. Subtask 6: Create Performance Monitoring and Debug Tools
* `[x]` Task completed.
* `[x]` Test cases:
  * Should track and report frame rate
  * Should identify performance bottlenecks
  * Should provide visualization of timing data
  * Should log timing issues for debugging
* `[ ]` Test cases reviewed and approved.
* Testing Type: Unit

### 6.7. Subtask 7: E2E Testing with Simple Gameplay Scenario
* `[ ]` Task completed.
* `[ ]` Test cases:
  * Should maintain accurate timing in a complete gameplay flow
  * Should properly sync visuals, audio, and input handling
  * Should perform consistently under different system loads
* `[ ]` Test cases reviewed and approved.
* Testing Type: E2E 