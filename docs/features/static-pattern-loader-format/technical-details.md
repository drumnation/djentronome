# Technical Details: Static Pattern Loader & Format

## Overview
The Static Pattern Loader & Format feature provides a standardized way to define, load, and parse rhythm patterns for the Djentronome application. It enables the creation of reusable rhythm patterns that can be loaded from static JSON files and used by the game loop and scoring system. The feature includes a robust validation system, caching capabilities, and utilities for pattern manipulation.

## Key Design Decisions & Rationale
* Decision 1: JSON-based pattern format - Enables easy editing, sharing, and storage of patterns while maintaining compatibility with web technologies.
* Decision 2: Support for both flat note arrays and hierarchical sections - Provides flexibility for representing both simple and complex rhythm patterns.
* Decision 3: Comprehensive validation system - Ensures patterns meet the required format before being used in the game, preventing runtime errors.
* Decision 4: Caching mechanism - Improves performance by reducing redundant loading and parsing of frequently used patterns.
* Decision 5: Asynchronous loading API - Supports loading patterns from local and remote sources without blocking the main thread.

## Implementation Notes
The pattern loader is implemented as a standalone module that can be imported by other components. It provides a simple API for loading and validating patterns, with additional utilities for common pattern operations.

### Pattern Format Specification

#### Pattern Structure
```typescript
interface Pattern {
  id: string;             // Unique identifier for the pattern
  version: string;        // Version of the pattern format
  metadata: PatternMetadata;  // Pattern metadata
  duration: number;       // Total duration in milliseconds
  sections?: PatternSection[]; // Optional sections within the pattern
  notes?: Note[];         // Optional notes (if not using sections)
  audioFile?: string;     // Optional path to accompanying audio
}
```

#### Pattern Metadata
```typescript
interface PatternMetadata {
  title: string;           // Pattern title
  artist?: string;         // Original artist (if applicable)
  creator?: string;        // Creator of the pattern file
  difficulty: DifficultyLevel; // Difficulty rating
  bpm: number;             // Tempo in beats per minute
  timeSignature: string;   // Time signature (e.g., "4/4")
  tags?: string[];         // Optional categorization tags
  [key: string]: any;      // Additional metadata fields
}
```

#### Note Definition
```typescript
interface Note {
  time: number;           // Time in milliseconds when note occurs
  type: string;           // Type of note (kick, snare, etc.)
  midiNote?: number;      // Optional MIDI note number
  velocity?: number;      // Optional velocity/intensity (0-1)
  duration?: number;      // Optional duration for held notes
  metadata?: Record<string, any>; // Optional additional data
}
```

#### Pattern Section
```typescript
interface PatternSection {
  id: string;             // Unique section identifier
  name: string;           // Human-readable section name
  startTime: number;      // Section start time in milliseconds
  endTime: number;        // Section end time in milliseconds
  notes: Note[];          // Notes within this section
}
```

### Example Pattern File
```json
{
  "pattern": {
    "id": "basic-rock-beat",
    "version": "1.0",
    "metadata": {
      "title": "Basic Rock Beat",
      "difficulty": "beginner",
      "bpm": 120,
      "timeSignature": "4/4",
      "tags": ["rock", "beginner"]
    },
    "duration": 4000,
    "sections": [
      {
        "id": "main",
        "name": "Main Beat",
        "startTime": 0,
        "endTime": 4000,
        "notes": [
          { "time": 0, "type": "kick", "midiNote": 36 },
          { "time": 500, "type": "snare", "midiNote": 38 },
          { "time": 1000, "type": "kick", "midiNote": 36 },
          { "time": 1500, "type": "snare", "midiNote": 38 },
          { "time": 2000, "type": "kick", "midiNote": 36 },
          { "time": 2500, "type": "snare", "midiNote": 38 },
          { "time": 3000, "type": "kick", "midiNote": 36 },
          { "time": 3500, "type": "snare", "midiNote": 38 }
        ]
      }
    ]
  }
}
```

## Usage / API

### Loading a Pattern
```typescript
import { PatternLoader } from '@djentronome/pattern-loader';

// Create a pattern loader
const loader = new PatternLoader({ 
  basePath: '/assets/patterns',
  validate: true
});

// Load a pattern
const pattern = await loader.loadPattern('rock-beat.json');

// Use the pattern
console.log(`Loaded: ${pattern.metadata.title}`);
console.log(`Total notes: ${pattern.notes?.length || 
  pattern.sections?.reduce((total, section) => total + section.notes.length, 0)}`);
```

### Creating a Pattern Programmatically
```typescript
import { PatternLoader, DifficultyLevel } from '@djentronome/pattern-loader';

const loader = new PatternLoader();

const pattern = loader.createPattern({
  id: 'custom-pattern',
  metadata: {
    title: 'Custom Pattern',
    difficulty: DifficultyLevel.BEGINNER,
    bpm: 100,
    timeSignature: '4/4'
  },
  duration: 2000,
  notes: [
    { time: 0, type: 'kick' },
    { time: 500, type: 'snare' },
    { time: 1000, type: 'kick' },
    { time: 1500, type: 'snare' }
  ]
});

// Validate the pattern
const validation = loader.validatePattern(pattern);
if (validation.valid) {
  console.log('Pattern is valid');
} else {
  console.error('Pattern is invalid:', validation.errors);
}
```

## Gotchas / Known Issues
- When using sections, ensure that every note belongs to exactly one section to avoid overlapping notes.
- For patterns with audio files, ensure the audio duration matches the pattern duration for proper synchronization.
- Pattern loading from remote sources may fail if CORS is not properly configured.
- Very large patterns (thousands of notes) may cause performance issues during loading and processing.
- Patterns with complex polyrhythms or tempo changes may require additional processing before use with the game loop. 