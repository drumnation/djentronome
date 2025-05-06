# Pattern Loader Package

A package for loading, parsing, and managing rhythm patterns for the Djentronome rhythm game.

## Features

- Load patterns from JSON files
- Validate pattern structure
- Support for sectioned patterns (intro, verse, chorus, etc.)
- Support for metadata (title, artist, BPM, etc.)
- Type-safe pattern handling

## Usage

```typescript
import { PatternLoader, Pattern, DifficultyLevel } from '@djentronome/pattern-loader';

// Create a loader
const patternLoader = new PatternLoader({
  basePath: '/assets/patterns',
  validate: true
});

// Load a pattern from a file
async function loadGamePattern() {
  try {
    const pattern = await patternLoader.loadPattern('basic-rock-beat.json');
    console.log(`Loaded pattern: ${pattern.metadata.title}`);
    console.log(`Duration: ${pattern.duration}ms, BPM: ${pattern.metadata.bpm}`);
    console.log(`Total notes: ${pattern.notes?.length || 0}`);
    return pattern;
  } catch (error) {
    console.error('Failed to load pattern:', error);
    throw error;
  }
}

// Create a pattern programmatically
function createSimplePattern(): Pattern {
  return patternLoader.createPattern({
    id: 'simple-beat',
    metadata: {
      title: 'Simple Beat',
      difficulty: DifficultyLevel.BEGINNER,
      bpm: 90,
      timeSignature: '4/4'
    },
    duration: 4000, // 4 seconds
    notes: [
      { time: 0, type: 'kick', midiNote: 36 },
      { time: 1000, type: 'snare', midiNote: 38 },
      { time: 2000, type: 'kick', midiNote: 36 },
      { time: 3000, type: 'snare', midiNote: 38 }
    ]
  });
}

// Validate a pattern
function validateUserPattern(userPattern: Pattern) {
  const validation = patternLoader.validatePattern(userPattern);
  if (!validation.valid) {
    console.error('Invalid pattern:', validation.errors);
    return false;
  }
  return true;
}
```

## Pattern File Format

Patterns are stored in JSON format with the following structure:

```json
{
  "pattern": {
    "id": "pattern-id",
    "version": "1.0",
    "metadata": {
      "title": "Pattern Title",
      "artist": "Artist Name",
      "creator": "Creator Name",
      "difficulty": "medium",
      "bpm": 120,
      "timeSignature": "4/4",
      "tags": ["tag1", "tag2"]
    },
    "duration": 8000,
    "notes": [
      { "time": 0, "type": "kick", "midiNote": 36, "velocity": 0.8 },
      { "time": 1000, "type": "snare", "midiNote": 38, "velocity": 0.9 }
    ],
    "sections": [
      {
        "id": "intro",
        "name": "Intro",
        "startTime": 0,
        "endTime": 4000,
        "notes": [
          { "time": 0, "type": "kick", "midiNote": 36 }
        ]
      }
    ]
  }
}
```

## API

### `PatternLoader`

The main class for loading and managing patterns.

#### Constructor

```typescript
new PatternLoader(options?: PatternLoaderOptions)
```

Options:
- `basePath`: Base path for pattern files (default: `''`)
- `validate`: Whether to validate patterns on load (default: `false`)
- `defaultVersion`: Default version for patterns (default: `'1.0'`)

#### Methods

- `loadPattern(path: string): Promise<Pattern>`: Load a pattern from a file
- `createPattern(data: Partial<Pattern>): Pattern`: Create a pattern object from raw data
- `validatePattern(pattern: Pattern): ValidationResult`: Validate a pattern object

### Types

```typescript
// Difficulty levels
enum DifficultyLevel {
  BEGINNER = 'beginner',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

// Note in a pattern
interface Note {
  time: number;       // Time in milliseconds
  type: string;       // Note type (kick, snare, etc.)
  midiNote?: number;  // MIDI note number
  velocity?: number;  // Velocity (0-1)
  duration?: number;  // Duration in milliseconds
}

// Pattern section
interface PatternSection {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  notes: Note[];
}

// Complete pattern
interface Pattern {
  id: string;
  version: string;
  metadata: PatternMetadata;
  duration: number;
  sections?: PatternSection[];
  notes?: Note[];
  audioFile?: string;
}
``` 