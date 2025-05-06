---
title: "Game Loop & Pattern Player Integration"
description: "Details on how the game loop synchronizes with rhythm patterns for precise timing"
keywords:
  - game-loop
  - pattern-loader
  - synchronization
  - timing
  - rhythm
related_features: ["basic-game-loop", "static-pattern-loader-format"]
last_updated: "2025-05-18"
---

# Game Loop & Pattern Player Integration

This document explains how the game loop system synchronizes with rhythm patterns to enable precise timing in the Djentronome rhythm game.

## Overview

The integration between the game loop and pattern player is a critical component of the rhythm game. It ensures that:

1. Pattern playback is synchronized with the game's time system
2. Notes are triggered at the correct times
3. Visual and audio cues remain in sync
4. Section changes are properly managed

## Architecture

The integration uses the `GameLoopPatternIntegration` class which acts as a bridge between the `GameLoop` and `PatternPlayer` components:

```
┌─────────────┐     ┌────────────────────────────┐     ┌─────────────────┐
│  GameLoop   │────▶│ GameLoopPatternIntegration │────▶│  PatternPlayer  │
└─────────────┘     └────────────────────────────┘     └─────────────────┘
      │                           │                            │
      │                           │                            │
      ▼                           ▼                            ▼
┌─────────────┐          ┌─────────────┐            ┌───────────────────┐
│ Update Tick │          │ Event System │           │ Pattern Playback  │
└─────────────┘          └─────────────┘            └───────────────────┘
```

### Key Components

- **GameLoop**: Provides the fixed-timestep update loop and timing system
- **PatternPlayer**: Manages pattern data and triggers notes at the correct times
- **GameLoopPatternIntegration**: Synchronizes these systems and provides a clean API

## Implementation

### Initialization

```typescript
// Create a game loop
const gameLoop = new GameLoop({
  update: (deltaTime) => { /* game logic */ },
  render: (deltaTime, interpolation) => { /* rendering */ }
});

// Create pattern loader and player
const patternLoader = new PatternLoader();
const patternPlayer = new PatternPlayer(patternLoader);

// Create and initialize the integration
const integration = new GameLoopPatternIntegration(gameLoop, patternPlayer);
integration.initialize();
```

### Event System

The integration uses the Observer pattern to handle various events:

1. **Game Loop Events**: Start, stop, pause, resume are synchronized with pattern playback
2. **Pattern Events**: Note triggers, section changes, pattern completion

### Timing Synchronization

During each game update, the integration passes the current game time to the pattern player:

```typescript
// This happens automatically inside the integration
gameLoop.on(GameLoopEventType.UPDATE, (event) => {
  patternPlayer.update(gameLoop.getTimeProvider().getTime());
});
```

### Look-Ahead System

The pattern player uses look-ahead timing to prepare upcoming notes and minimize latency:

- **lookAheadTime**: How far ahead (in ms) to look for upcoming notes (default: 500ms)
- **triggerBuffer**: How early to trigger notes for better timing (default: 10ms)

## Usage Examples

### Basic Setup

```typescript
// Create and initialize components
const gameLoop = new GameLoop({ /* options */ });
const patternPlayer = new PatternPlayer(new PatternLoader());
const integration = new GameLoopPatternIntegration(gameLoop, patternPlayer);

// Initialize
integration.initialize();

// Set up event handlers
integration.onNoteTrigger((note) => {
  // Handle note trigger (play sound, update visuals)
});

// Load a pattern
await integration.loadPatternFromPath('patterns/example.json');

// Start playback
gameLoop.start(); // Pattern will auto-start if configured
```

### Advanced Configuration

```typescript
const integration = new GameLoopPatternIntegration(
  gameLoop, 
  patternPlayer,
  {
    autoStartWithLoop: true,    // Start pattern when game starts
    autoPauseWithLoop: true,    // Pause pattern when game pauses
    autoResumeWithLoop: true,   // Resume pattern when game resumes
    autoStopWithLoop: true,     // Stop pattern when game stops
    lookAheadTime: 500,         // Look ahead 500ms
    triggerBuffer: 10           // Trigger notes 10ms early
  }
);
```

## Integration Tests

The integration is thoroughly tested to ensure:

1. Pattern playback is properly synchronized with game time
2. Pattern events are triggered at the correct times
3. Pattern loading/unloading during gameplay works correctly
4. Timing precision is maintained across different patterns

## Performance Considerations

- The integration is designed to minimize overhead during the game loop update
- The pattern player uses a look-ahead system to efficiently process upcoming notes
- Event callbacks are kept lightweight to avoid impacting the game loop timing

## Next Steps

This integration lays the groundwork for future features:

- **Hit Detection & Scoring**: Will build on this integration to measure player timing
- **Latency Calibration**: Will use this system to measure and compensate for input and audio latency
- **Visual Effects**: Will sync visual elements with pattern timing 