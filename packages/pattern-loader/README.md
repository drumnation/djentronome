# Pattern Loader

A module for loading and validating rhythm patterns in the Djentronome application.

## Overview

The Pattern Loader provides functionality to:

- Load pattern files from various sources
- Validate patterns against a schema
- Cache patterns for improved performance
- Create patterns from raw data

## Modular Design

This module follows a modular design with separation of concerns:

```
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│   PatternLoader   │────▶│   PatternCache    │
│                   │     │                   │
└─────────┬─────────┘     └───────────────────┘
          │
          │
          ▼
┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │
│  PatternValidator │◀────│    /types         │
│                   │     │                   │
└───────────────────┘     └───────────────────┘
```

### Components

1. **PatternLoader**: Main entry point that handles loading patterns from sources
   - Coordinates between cache and validator
   - Handles HTTP requests and error handling
   - Manages pattern creation from raw data

2. **PatternCache**: Handles caching of loaded patterns
   - Implements LRU-like cache with configurable size
   - Provides add/get/remove/clear operations
   - Improves performance by avoiding repeated loading

3. **PatternValidator**: Validates pattern structure and data
   - Ensures required fields are present
   - Validates values against constraints
   - Detects structural issues like section overlaps
   - Provides detailed error information

4. **Types**: Shared type definitions for patterns
   - Pattern structure and metadata
   - Validation types
   - Common enums like DifficultyLevel

## Usage

```typescript
import { PatternLoader } from '@djentronome/pattern-loader';

// Create a loader with options
const loader = new PatternLoader({
  basePath: '/assets/patterns',
  validate: true,
  enableCache: true,
  cacheSize: 20
});

// Load a pattern
const pattern = await loader.loadPattern('my-pattern.json');

// Create a pattern from data
const customPattern = loader.createPattern({
  id: 'custom-pattern',
  metadata: {
    title: 'My Custom Pattern',
    difficulty: 'medium',
    bpm: 120,
    timeSignature: '4/4'
  },
  // ... other properties
});

// Validate a pattern
const validationResult = loader.validatePattern(customPattern);
if (!validationResult.valid) {
  console.error('Validation errors:', validationResult.errors);
}
```

## Benefits of Modular Design

- **Separation of Concerns**: Each class has a single responsibility
- **Improved Testability**: Each component can be tested in isolation
- **Better Maintainability**: Clear boundaries between different concerns
- **Extensibility**: Easy to add new features to specific components
- **Reusability**: Components can be used independently

## Testing

This package uses Vitest for unit and integration testing:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage
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