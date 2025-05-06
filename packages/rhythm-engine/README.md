# Rhythm Engine Package

A core engine for rhythm game mechanics including hit detection, scoring, and game state management for the Djentronome project.

## Features

- Hit detection with configurable timing windows
- Scoring system with customizable point values and multipliers
- Game state management (idle, playing, paused, game over)
- Event-based architecture for game events (hits, misses, score updates)
- Latency compensation for input devices
- Automatic handling of missed notes
- Comprehensive stats tracking (score, combo, accuracy, etc.)

## Usage

```typescript
import { RhythmEngine, GameState, HitAccuracy } from '@djentronome/rhythm-engine';
import { PatternLoader } from '@djentronome/pattern-loader';
import { MIDIHandler } from '@djentronome/core-midi';

// Create a rhythm engine instance
const rhythmEngine = new RhythmEngine({
  latencyOffset: 30, // Compensate for 30ms of input latency
  autoHandleMisses: true, // Automatically detect when notes are missed
  scoringConfig: {
    perfectWindow: 40, // Make the timing window for perfect hits slightly larger
    perfectPoints: 150 // More points for perfect hits
  }
});

// Load a pattern
const patternLoader = new PatternLoader();
const pattern = await patternLoader.loadPattern('patterns/basic-beat.json');
rhythmEngine.loadPattern(pattern);

// Set up MIDI input
const midiHandler = new MIDIHandler();
await midiHandler.connect();

// Handle MIDI input events
midiHandler.addEventListener('midimessage', (message) => {
  if (message.type === 'noteon') {
    // Pass MIDI input to the rhythm engine
    rhythmEngine.processInput({
      type: 'midi',
      value: message.note,
      timestamp: message.timestamp,
      velocity: message.velocity,
      originalEvent: message
    });
  }
});

// Listen for hit events
rhythmEngine.addEventListener('hit', (event) => {
  const hitResult = event.data;
  
  console.log(`Hit with ${hitResult.accuracy} accuracy!`);
  console.log(`Score: ${rhythmEngine.getStats().score}`);
  
  // Update the UI or play sound effects based on hit accuracy
  // ...
});

// Listen for miss events
rhythmEngine.addEventListener('miss', (event) => {
  console.log('Missed note!');
  console.log(`Combo broken! Max combo: ${rhythmEngine.getStats().maxCombo}`);
  
  // Update the UI or play sound effects for misses
  // ...
});

// Start the game
rhythmEngine.start();

// Later, pause or stop the game
rhythmEngine.pause();
rhythmEngine.resume();
rhythmEngine.stop();

// When finished, dispose of the engine
rhythmEngine.dispose();
```

## API

### `RhythmEngine`

The main class for the rhythm engine.

#### Constructor

```typescript
new RhythmEngine(options?: RhythmEngineOptions)
```

Options:
- `scoringConfig`: Configuration for scoring (points, timing windows)
- `latencyOffset`: Input latency compensation in milliseconds
- `autoHandleMisses`: Whether to automatically detect missed notes
- `lookAheadTime`: Time in milliseconds to look ahead for upcoming notes

#### Methods

- `loadPattern(pattern: Pattern): void`: Load a pattern into the engine
- `start(): void`: Start the game
- `pause(): void`: Pause the game
- `resume(): void`: Resume a paused game
- `stop(): void`: Stop the game
- `processInput(input: InputEvent): void`: Process an input event
- `addEventListener(type: RhythmEngineEventType, listener: function): void`: Add an event listener
- `removeEventListener(type: RhythmEngineEventType, listener: function): void`: Remove an event listener
- `getState(): GameState`: Get the current game state
- `getPattern(): Pattern | null`: Get the current loaded pattern
- `getStats(): GameStats`: Get the current game stats
- `getOptions(): RhythmEngineOptions`: Get the current engine options
- `dispose(): void`: Clean up resources

### Types

#### `HitAccuracy`

Enum for hit accuracy ratings:
- `PERFECT`
- `GREAT`
- `GOOD`
- `OKAY`
- `MISS`

#### `GameState`

Enum for game states:
- `IDLE`
- `CALIBRATING`
- `COUNTDOWN`
- `PLAYING`
- `PAUSED`
- `GAME_OVER`

#### `HitResult`

Result of a hit attempt:
- `hit`: Whether the hit was successful
- `accuracy`: Accuracy rating
- `timeDelta`: Time difference in milliseconds
- `points`: Points awarded
- `note`: The note that was hit or missed
- `timestamp`: When the hit occurred

#### `GameStats`

Game statistics:
- `score`: Total score
- `combo`: Current combo
- `maxCombo`: Maximum combo achieved
- `perfectCount`: Count of perfect hits
- `greatCount`: Count of great hits
- `goodCount`: Count of good hits
- `okayCount`: Count of okay hits
- `missCount`: Count of misses
- `totalNotes`: Total notes in the pattern
- `notesHit`: Total notes hit successfully
- `accuracy`: Overall accuracy percentage
- `progress`: Progress through the pattern (0-1)

#### `RhythmEngineEventType`

Types of events emitted by the engine:
- `HIT`: When a note is hit successfully
- `MISS`: When a note is missed
- `GAME_STATE_CHANGED`: When the game state changes
- `PATTERN_LOADED`: When a pattern is loaded
- `PATTERN_STARTED`: When a pattern starts playing
- `PATTERN_COMPLETED`: When a pattern is completed
- `SECTION_CHANGED`: When moving to a new section of a pattern
- `STATS_UPDATED`: When game stats are updated
- `ERROR`: When an error occurs

## Performance Considerations

- The rhythm engine is designed to be fast and efficient for real-time gameplay
- Hit detection algorithms are optimized for low latency
- Event handlers should be kept simple to avoid frame drops
- The engine is designed to work with the game loop for consistent timing

## Integration with Other Packages

The rhythm engine is designed to work with:
- `@djentronome/core-midi`: For MIDI input
- `@djentronome/pattern-loader`: For rhythm patterns
- `@djentronome/game-loop`: For the game update loop
- `@djentronome/latency-calibration`: For input latency calibration 