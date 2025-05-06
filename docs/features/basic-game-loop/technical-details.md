# Technical Details: Basic Game Loop

## Overview
The Basic Game Loop feature provides a robust foundation for the rhythm game's timing and synchronization mechanisms. It implements a fixed timestep pattern with interpolation to ensure consistent gameplay across different devices and frame rates. The loop manages the core update and render cycle, integrates with other core systems via events, and provides precise timing controls essential for rhythm-based gameplay.

## Key Design Decisions & Rationale
* Decision 1: Fixed Timestep with Interpolation - We chose a fixed timestep approach to ensure consistent physics/logic updates regardless of render frame rate. This is crucial for a rhythm game where timing precision directly impacts gameplay. The interpolation factor allows for smooth rendering between fixed steps.
* Decision 2: Observer Pattern for System Communication - The game loop uses an event system to communicate with other modules (audio, input, rendering) without direct dependencies. This decoupling simplifies integration with different subsystems and allows for cleaner architecture.
* Decision 3: Time Provider Pattern - We implemented a dedicated time provider service that centralizes all timing-related functionality. This allows any component to query consistent timing information and supports features like pausing, time scaling, and synchronized playback.
* Decision 4: Performance Monitoring - Built-in performance tracking helps identify bottlenecks and ensures the game maintains optimal frame rates, which is essential for rhythm gameplay.

## Implementation Notes
* The core GameLoop class uses requestAnimationFrame for rendering but maintains its own fixed update cycle decoupled from rendering.
* The accumulator pattern prevents the "spiral of death" by limiting the maximum number of updates per frame.
* Time scaling allows for special effects like slow motion or fast forward without changing core gameplay logic.
* Error handling in the event system ensures that one faulty component won't crash the entire game loop.
* The pause/resume functionality freezes updates but continues rendering, which is useful for menus and game state transitions.

## Usage / API
```typescript
// Create a game loop with update and render callbacks
const gameLoop = new GameLoop({
  fps: 60, // Target updates per second
  update: (deltaTime) => {
    // Update game logic with fixed timestep
  },
  render: (deltaTime, interpolation) => {
    // Render with interpolation factor
  },
  maxUpdatesPerFrame: 5 // Prevent spiral of death
});

// Subscribe to game loop events
gameLoop.on(GameLoopEventType.UPDATE, (event) => {
  // React to update events
});

// Start/stop the loop
gameLoop.start();
gameLoop.stop();

// Pause/resume (continues rendering but freezes updates)
gameLoop.pause();
gameLoop.resume();

// Control time scale
gameLoop.setTimeScale(0.5); // Slow motion

// Get performance stats
const stats = gameLoop.getPerformanceStats();
```

## Gotchas / Known Issues
* Test files are prepared but there are issues running the tests due to vitest configuration. This needs to be addressed before completing the integration steps.
* The GameLoop needs integration with pattern-loader and audio-engine to fully implement the rhythm game functionality.
* Complex patterns with many notes could potentially cause performance issues if the update frequency is too high.
* Time provider's interpolation may not handle extremely variable frame rates well in some edge cases. 