# Technical Details: Core Packages Scaffolding

**Last Updated:** 2025-05-05

## Overview
The Core Packages Scaffolding feature establishes the foundational packages required for the Djentronome rhythm game. It creates a set of modular, focused packages that provide the core functionality needed for MIDI integration, pattern loading, game mechanics, and latency calibration.

## Key Design Decisions & Rationale
* **Micropackage Architecture**: Using small, focused packages with clear boundaries to improve maintainability, testability, and reusability across the project.
  * Rationale: Enables parallel development, clear separation of concerns, and easier testing of individual components.
* **Unidirectional Dependencies**: Ensuring that package dependencies flow in one direction to avoid circular dependencies.
  * Rationale: Simplifies the build process, improves type safety, and makes the codebase easier to reason about.
* **Consistent Package Structure**: Following a standardized structure across all packages.
  * Rationale: Improves developer experience with predictable file locations and reduces cognitive load when switching between packages.
* **TypeScript with Strong Typing**: Focusing on well-defined interfaces and type exports.
  * Rationale: Catches errors earlier in development and provides better IDE support for developers.

## Implementation Notes
### Package Specifications:

#### 1. core-midi Package
- **Purpose**: Manage Web MIDI device connections and message handling
- **Key Exports**: 
  - `MIDIHandler`: Main class for MIDI device management
  - `MIDIMessage`: Interface for MIDI message data
  - `MIDIDevice`: Class representing a connected MIDI device
- **Dependencies**: No internal dependencies
- **Used By**: input, rhythm-engine

#### 2. pattern-loader Package
- **Purpose**: Load, parse, and manage rhythm patterns
- **Key Exports**:
  - `PatternLoader`: Class for loading/parsing pattern files
  - `Pattern`: Interface defining the pattern structure
  - `Note`: Interface for note data
- **Dependencies**: utils
- **Used By**: rhythm-engine, game-state

#### 3. rhythm-engine Package
- **Purpose**: Core gameplay mechanics including hit detection and scoring
- **Key Exports**:
  - `RhythmEngine`: Main class for rhythm game logic
  - `HitResult`: Enum for hit accuracy results
  - `ScoreCalculator`: Utility for score calculation
- **Dependencies**: core-midi, pattern-loader, game-loop, utils
- **Used By**: game-state, game-core

#### 4. latency-calibration Package
- **Purpose**: Measure and compensate for input latency
- **Key Exports**:
  - `LatencyCalibrator`: Class for measuring and storing latency
  - `LatencyTest`: Interface for test parameters
  - `applyLatencyOffset`: Utility function
- **Dependencies**: core-audio, core-midi, utils
- **Used By**: rhythm-engine, input

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

// Start the game
rhythmEngine.loadPattern(pattern);
rhythmEngine.start();
```

## Gotchas / Known Issues
- Web MIDI API requires HTTPS or localhost for security reasons
- Pattern loading is asynchronous and needs proper error handling
- Latency calibration should be performed in the actual environment where the game will run
- Package circular dependencies must be avoided - always check dependency graph before adding a new dependency 