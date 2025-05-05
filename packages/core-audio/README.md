# Core Audio Package

Audio engine for the Djentronome rhythm game, built on the Web Audio API.

## Features

- Simple and flexible sound management
- Volume control with master volume
- Sound instance tracking
- Dynamic loading and playback
- Adjustable playback rate, looping, and volume per sound
- Resource cleanup and management

## Usage

```typescript
import { AudioEngine, SoundConfig } from '@djentronome/core-audio';

// Create and initialize the audio engine
const audioEngine = new AudioEngine({
  masterVolume: 0.8,
  enabled: true,
  preloadSounds: false
});

// Initialize the audio context (must be done in response to user interaction)
await audioEngine.initialize();

// Load a sound
const kickSound: SoundConfig = {
  src: '/assets/sounds/kick.mp3',
  volume: 1.0,
  loop: false
};

await audioEngine.loadSound('kick', kickSound);

// Play a sound
const instanceId = audioEngine.playSound('kick', {
  // Optional overrides for this playback
  volume: 0.9,
  playbackRate: 1.2
});

// Stop a specific sound instance
if (instanceId) {
  audioEngine.stopSound(instanceId);
}

// Adjust master volume
audioEngine.setMasterVolume(0.6);

// Disable audio temporarily
audioEngine.setEnabled(false);

// Re-enable audio
audioEngine.setEnabled(true);

// Clean up resources when done
audioEngine.dispose();
```

## API

### `AudioEngine`

The main class for loading and playing sounds.

#### Constructor

```typescript
new AudioEngine(options?: AudioEngineOptions)
```

#### Methods

- `initialize()`: Initialize the audio engine
- `loadSound(id: string, config: SoundConfig)`: Load a sound file
- `playSound(id: string, options?: Partial<SoundConfig>)`: Play a sound
- `stopSound(instanceId: string)`: Stop a specific sound instance
- `setMasterVolume(volume: number)`: Set the master volume (0-1)
- `getMasterVolume()`: Get the current master volume
- `setEnabled(enabled: boolean)`: Enable or disable audio
- `isEnabled()`: Check if audio is enabled
- `dispose()`: Clean up resources

### `SoundConfig`

Configuration for a sound file.

```typescript
interface SoundConfig {
  src: string;       // Path to the audio file
  volume?: number;   // Volume level (0-1)
  loop?: boolean;    // Whether to loop the sound
  playbackRate?: number; // Playback rate (1 = normal)
}
```

### `AudioEngineOptions`

Options for initializing the audio engine.

```typescript
interface AudioEngineOptions {
  masterVolume?: number;  // Master volume level (0-1)
  enabled?: boolean;      // Whether audio is enabled
  preloadSounds?: boolean; // Whether to preload all sounds
}
``` 