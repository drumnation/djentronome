# Feature Task Plan

## Feature: Gameplay Visualization (Basic)

## Task: Implement the basic note highway visualization

## Status: ⭕ Planning

## Last Updated: 2023-06-17

## Related Documentation:
- Feature Index: ../../../../docs/features/gameplay-visualization/gameplay-visualization.index.md
- Technical Details Doc: ../../../../docs/features/gameplay-visualization/technical-details.md

## 1. Overview

This task involves implementing the basic visualization for the gameplay elements of Djentronome, focusing on the note highway. The note highway is a central visual element where notes scroll down (or across) the screen to indicate when the player should hit them. This visualization needs to synchronize with the audio engine, respond to user input, and provide clear visual feedback to the player.

## 2. Codebase Analysis

### 2.1. Key Files & Modules

* `packages/core-audio/src/index.ts`: Core audio engine with sound playback capabilities
* `packages/core-graphics/src/index.ts`: Basic 2D renderer for canvas drawing
* `packages/game-core/src/index.ts`: Game engine with scene management and game loop
* `packages/game-core/src/types/index.ts`: Game core types including scene and state interfaces
* `apps/game-ui/src/`: Main React application where visualization will be integrated
* `packages/ui/src/`: Shared UI components following Atomic Design principles

### 2.2. Dependencies

* React: Frontend UI library
* @react-three/fiber: React renderer for Three.js (from r3f-usage-core.rules)
* @react-three/drei: Three.js helper components
* three: 3D rendering library
* Mantine UI: UI component library for any overlay elements
* zustand: State management for game state
* TypeScript: Static typing

### 2.3. Potential Concerns

* Synchronization between audio playback and visual elements
* Performance optimization for smooth animations, especially with many notes
* Responsive design to handle different screen sizes and orientations
* Integration with existing UI components and layout
* [ ] Mark as addressed

## 3. Architectural Considerations

### 3.1. Selected Paradigm

* Component-Based Architecture - Using React and react-three-fiber for modular, declarative 3D visualization
* [ ] Confirmed with the user

### 3.2. Selected Design Patterns

* Entity-Component System (ECS) - For managing game objects like notes, lanes, and feedback effects
* [ ] Confirmed with the user
* Observer Pattern - For reacting to game state changes and audio events
* [ ] Confirmed with the user
* Composition Pattern - For building complex visual elements from simple, reusable components
* [ ] Confirmed with the user

### 3.3. Architectural Considerations & Rationale

* The Component-Based Architecture using React and react-three-fiber allows us to create declarative 3D visualizations that integrate seamlessly with the existing React application. This approach maintains consistency with the rest of the UI while allowing for high-performance rendering.

* The Entity-Component System (ECS) is ideal for game development as it separates data from behavior, making it easier to manage the various game objects (notes, lanes, etc.) and their properties. This will make it simpler to extend the visualization in the future.

* The Observer Pattern will help maintain synchronization between the audio engine and visual elements. By having components observe the game state and audio events, we can ensure the visualization stays in sync with the audio.

* The Composition Pattern aligns with React's component model and will allow us to build complex visual effects from simple building blocks. This enhances reusability and makes the code more maintainable.

* Using react-three-fiber instead of a custom WebGL solution allows us to leverage Three.js's powerful features while keeping the React programming model. This reduces the learning curve and makes the code more accessible.
* [ ] Confirmed with the user

## 4. Project Task List Foresight

### 4.1. Downstream Impacts

* This visualization foundation will directly impact:
  * F11: Gameplay UI Screens - Score display and gameplay feedback will need to integrate with the note highway
  * F12: Latency Calibration Tool - The visualization timing will be critical for accurate calibration
  * F15: Visualization Enhancement (R3F) - This basic implementation will be extended with more advanced 3D features
* Decisions about the coordinate system, scrolling mechanism, and event system will establish patterns that future features will need to follow
* [ ] Reviewed and confirmed no negative impacts

### 4.2. Future-Proofing Considerations

* Implement a flexible coordinate system that can adapt to different screen orientations and note patterns
* Create an abstraction for timing and synchronization that can be reused across features
* Design a modular note and lane system that can be extended for different game modes
* Use shaders or instanced meshes for performance optimization to support more complex visualizations later
* Ensure the visualization layer can communicate bidirectionally with the game logic layer
* [ ] Discussed with the user and incorporated feedback

## 5. Testing Strategy

### 5.1. Available Testing Options

* `[X] Unit Tests`
    * Location: `packages/*/src/test/` or `apps/game-ui/src/test/`
    * Command to run all tests: `pnpm test` or `pnpm vitest run`
    * Command to run a single test: `pnpm vitest run <test-file>`
    * Relevant Skill Jacks: (To be determined based on available skill jacks)

* `[X] Integration Tests`
    * Location: `packages/*/testing/integration/` or `tooling/testing/src/integration/`
    * Command to run all tests: `pnpm test:integration`
    * Command to run a single test: `pnpm vitest run --config tooling/testing/src/integration <test-file>`
    * Relevant Skill Jacks: (To be determined based on available skill jacks)

* `[X] Visual Regression Tests (Storybook)`
    * Location: `apps/game-ui/src/components/*/stories/`
    * Command to run tests: `pnpm storybook`
    * Relevant Skill Jacks: (To be determined based on available skill jacks)

* `[X] Storybook Interaction Tests`
    * Location: `apps/game-ui/src/components/*/stories/`
    * Command to run tests: `pnpm test:storybook`
    * Relevant Skill Jacks: (To be determined based on available skill jacks)

### 5.2. Selected Testing Approach

* For the Gameplay Visualization feature, we will primarily use:
  * Unit tests for core functions like timing calculations, note positioning, and state management
  * Visual Regression Tests with Storybook to ensure visual consistency of the note highway and its components
  * Storybook Interaction Tests to verify animations, user input handling, and state changes
  * Integration tests to validate the synchronization between audio and visuals
* This approach ensures comprehensive testing of both visual appearance and functional behavior while keeping tests maintainable
* For visual elements, we'll focus on testing the logic rather than the exact rendering, as Three.js components can be challenging to test with traditional methods
* [ ] Confirmed testing approach aligns with project standards

## 6. MECE Task Breakdown & TDD Plan

* ### 6.1. Subtask 1: Set up the Canvas and basic Three.js environment
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test that Canvas component renders correctly
      * Test that the Canvas has appropriate camera and lighting setup
      * Test responsiveness to window size changes
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Visual Regression
    * **Notes:** Create a Canvas component with appropriate camera setup and lighting for the note highway

* ### 6.2. Subtask 2: Implement Note Highway lanes and background
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test that lanes render correctly with proper spacing
      * Test that lane materials and colors match design specifications
      * Test background rendering and shader effects
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Visual Regression
    * **Notes:** Create the visual structure of the note highway with lanes and appropriate background

* ### 6.3. Subtask 3: Create Note component with proper styling and animations
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test that notes render with correct geometry and materials
      * Test different note types render differently
      * Test note visibility within camera frustum
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Visual Regression
    * **Notes:** Create a Note component that can represent different types of playable notes

* ### 6.4. Subtask 4: Implement scrolling mechanism and timing system
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test that notes scroll at the correct speed based on BPM
      * Test that scrolling adjusts properly when BPM changes
      * Test synchronization between visual position and time value
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Integration
    * **Notes:** Create a system to scroll notes down the highway in sync with audio timing

* ### 6.5. Subtask 5: Add hit detection and visual feedback
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test hit detection for different accuracy levels
      * Test visual feedback animations for hits, misses, and combos
      * Test that input events are correctly processed
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Integration, Storybook Interaction
    * **Notes:** Implement logic to detect when notes are hit and provide visual feedback

* ### 6.6. Subtask 6: Create Game State management with Zustand
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test game state initialization
      * Test state updates for score, combo, and timing
      * Test state persistence between scene transitions
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit
    * **Notes:** Set up state management for gameplay data like score, combo, and timing

* ### 6.7. Subtask 7: Connect audio engine with visualization
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test that audio playback triggers corresponding visual events
      * Test that timing data from audio engine is correctly used for visualization
      * Test audio-visual synchronization under different conditions
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Integration
    * **Notes:** Integrate the core-audio package with the visualization to ensure synchronization

* ### 6.8. Subtask 8: Optimize performance for smooth rendering
    * `[ ]` Task completed
    * `[ ]` Test cases:
      * Test frame rate under various note densities
      * Test performance optimizations like instanced meshes
      * Test performance on different device capabilities
    * `[ ]` Test cases reviewed and approved
    * Relevant Skill Jacks: (To be determined based on available skill jacks)
    * Testing Type: Unit, Integration
    * **Notes:** Apply performance optimizations to ensure smooth gameplay even with many notes 