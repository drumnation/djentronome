# Technical Details: Core Packages Scaffolding

**Last Updated:** 2025-05-05

## Overview
The Core Packages Scaffolding feature establishes the foundational packages required for the Djentronome rhythm game. It creates a set of modular, focused packages that provide the core functionality needed for MIDI integration, pattern loading, game mechanics, and latency calibration.

## Key Design Decisions & Rationale
* **Micropackage Architecture**: Using small, focused packages with clear boundaries to improve maintainability, testability, and reusability across the project.
  * Rationale: Enables parallel development, clear separation of concerns, and easier testing of individual components.
* **Unidirectional Dependencies**: Ensuring that package dependencies flow in one direction to avoid circular dependencies and make the system more maintainable.
  * Rationale: Reduces complexity and makes the system easier to reason about and test.
* **TypeScript-First Approach**: Using TypeScript for all packages to ensure type safety and provide better developer experience.
  * Rationale: Catches errors at compile time, improves code quality, and provides better code completion and documentation.
* **Test-Driven Development**: Writing tests before implementing functionality to ensure that code meets requirements and is testable.
  * Rationale: Improves code quality, ensures that code is testable, and reduces the risk of regressions.

## Package Structure and Responsibilities

### core-midi Package
A low-level package for managing MIDI device connections and processing MIDI messages.

**Key Functionality:**
- Web MIDI API integration
- MIDI device connection management
- MIDI message parsing and event handling
- Type-safe MIDI message handling

**Main Components:**
- `MIDIHandler`: Core class for managing MIDI devices and messages
- `MIDIMessage`: Interface for MIDI messages with parsed data (note, velocity, etc.)
- `MIDIConnectionStatus`: Enum for connection status (connected, disconnected, etc.)

### pattern-loader Package
A package for loading, parsing, and managing rhythm patterns.

**Key Functionality:**
- Load patterns from JSON files
- Validate pattern structure
- Support for sectioned patterns (intro, verse, chorus, etc.)
- Type-safe pattern handling

**Main Components:**
- `PatternLoader`: Core class for loading and validating patterns
- `Pattern`: Interface for rhythm patterns with metadata, notes, and sections
- `Note`: Interface for individual notes in a pattern
- `PatternSection`: Interface for sections within a pattern (intro, verse, etc.)

**Pattern Format:**
The pattern format is designed to be:
- Human-readable and editable in JSON
- Flexible to support different types of rhythm patterns
- Structured to support game features like scoring and visualization
- Type-safe with comprehensive TypeScript interfaces

### rhythm-engine Package
A core engine for rhythm game mechanics including hit detection, scoring, and game state management.

**Key Functionality:**
- Hit detection with configurable timing windows
- Scoring system with customizable point values and multipliers
- Game state management (idle, playing, paused, game over)
- Event-based architecture for game events
- Latency compensation for input devices
- Automatic handling of missed notes
- Comprehensive stats tracking

**Main Components:**
- `RhythmEngine`: Core class for managing game mechanics
- `HitResult`: Interface for hit detection results
- `HitAccuracy`: Enum for accuracy ratings (perfect, great, good, okay, miss)
- `GameState`: Enum for game states (idle, playing, paused, etc.)
- `GameStats`: Interface for game statistics

**Scoring System:**
The scoring system is designed to be:
- Configurable with different point values for different accuracy levels
- Support for combo multipliers
- Support for difficulty multipliers
- Accuracy-based rating system (perfect, great, good, okay, miss)
- Timing windows that can be adjusted for different difficulty levels

## Implementation Notes
- All packages follow a consistent structure with src/, types/, and testing/ directories
- Each package exports a well-defined API with proper TypeScript types
- Unit tests are implemented using Vitest and follow the TDD approach
- Integration tests for cross-package functionality will be added as development progresses

## Usage / API (If Applicable)
See individual package README files for detailed API documentation:
- [core-midi README](../../../packages/core-midi/README.md)
- [pattern-loader README](../../../packages/pattern-loader/README.md)
- [rhythm-engine README](../../../packages/rhythm-engine/README.md)

## Gotchas / Known Issues
- The Web MIDI API is only available in secure contexts (HTTPS or localhost)
- MIDI device access requires user permission, which must be handled in the UI
- Not all browsers support the Web MIDI API (Chrome and Edge have good support)
- Pattern loader uses fetch API which might need polyfills for older browsers
- Rhythm engine hit detection requires precise timing, which can be affected by browser performance
- Scoring may need adjustment based on player feedback and playtesting

## Usage / API (If Applicable)
The packages are designed to be used together but can also be used independently. Example integration:

```typescript
// Example of using the core packages together
import { MIDIHandler } from '@djentronome/core-midi';
import { PatternLoader } from '@djentronome/pattern-loader';
import { RhythmEngine } from '@djentronome/rhythm-engine';
import { LatencyCalibrator } from '@djentronome/latency-calibration';

// Initialize components
const midiHandler = new MIDIHandler();
const patternLoader = new PatternLoader();
const latencyCalibrator = new LatencyCalibrator();
const rhythmEngine = new RhythmEngine({
  patternLoader,
  midiHandler,
  latencyOffset: latencyCalibrator.getOffset()
});

// Load a pattern
const pattern = await patternLoader.loadPattern('path/to/pattern.json');

// Set up MIDI input handling
midiHandler.addEventListener('midimessage', (message) => {
  if (message.type === 'noteon') {
    rhythmEngine.processInput({
      type: 'midi',
      value: message.note,
      timestamp: message.timestamp,
      velocity: message.velocity,
      originalEvent: message
    });
  }
});

// Listen for game events
rhythmEngine.addEventListener('hit', (event) => {
  const hitResult = event.data;
  console.log(`Hit with ${hitResult.accuracy} accuracy!`);
});

// Start the game
rhythmEngine.loadPattern(pattern);
rhythmEngine.start();
``` 