# Metronome Module

## Overview

The Metronome module provides precise timing and audio playback for rhythm-based games and practice. It leverages the Core Audio Engine to deliver high-quality drum samples with accurate timing.

## Features

- Adjustable tempo (BPM)
- Customizable time signatures (beats per measure and beat unit)
- Multiple subdivision options (quarter notes, eighth notes, sixteenth notes)
- Triplet feel support
- Individual volume controls for each sound type
- High-quality drum samples

## Usage

### Basic Setup

```tsx
import { AudioEngine } from '../../core-audio/src';
import { Metronome } from '../../sound/src';

// Create and initialize the audio engine
const audioEngine = new AudioEngine();
await audioEngine.initialize();

// Create a metronome instance
const metronome = new Metronome(audioEngine, {
  tempo: 120,
  beatsPerMeasure: 4,
  beatUnit: 4,
  subdivision: 2,
  tripletFeel: false
});

// Load the metronome sounds
await metronome.loadSounds();

// Start the metronome
metronome.start();

// Stop the metronome
metronome.stop();
```

### Configuration Options

The metronome can be configured with the following options:

```tsx
interface MetronomeConfig {
  /** BPM (beats per minute) */
  tempo: number;
  /** Time signature numerator */
  beatsPerMeasure: number;
  /** Time signature denominator (4 = quarter note, 8 = eighth note, etc.) */
  beatUnit: number;
  /** Subdivision per beat (1 = quarter notes, 2 = eighth notes, 4 = sixteenth notes) */
  subdivision: number;
  /** Whether to use triplet feel */
  tripletFeel: boolean;
  /** Custom sound paths (optional) */
  sounds?: {
    downbeat?: string;
    quarterNote?: string;
    subdivision?: string;
    triplet?: string;
  };
  /** Volume levels for each sound type (0-1) */
  volumes?: {
    downbeat?: number;
    quarterNote?: number;
    subdivision?: number;
    triplet?: number;
  };
}
```

### React Component

A React component is available in `apps/game-ui/src/components/Metronome`.

```tsx
import { Metronome } from '../components/Metronome';

// In your component
<Metronome 
  initialConfig={{
    tempo: 120,
    beatsPerMeasure: 4,
    beatUnit: 4,
    subdivision: 2,
    tripletFeel: false
  }} 
/>
```

## Sound Samples

The metronome uses high-quality drum samples from the MusicRadar 1,000 Free Drum Samples collection. These samples are located in the `/public/drum-samples/` directory and are used as follows:

- **Downbeat**: Hi-hats open acoustic sample - Accentuated to anchor beat 1
- **Quarter Note**: Kick acoustic sample - Distinct but non-intrusive
- **Subdivision**: Hi-hats closed acoustic sample - High-pitched, short, subtle
- **Triplet**: Snare acoustic sample - Used for triplet subdivision

The default sound paths are defined in `DEFAULT_METRONOME_SOUNDS` but can be overridden in the metronome configuration. 