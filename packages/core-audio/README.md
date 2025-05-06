# Core Audio Package

Audio engine for the Djentronome rhythm game, built on the Web Audio API.

## Features

- Simple and flexible sound management
- Volume control with master volume
- Sound instance tracking
- Dynamic loading and playback
- Adjustable playback rate, looping, and volume per sound
- Resource cleanup and management
- Game event synchronization system
- Audio playback events with precise timing
- Support for local file loading from various sources

## Usage

```typescript
import { AudioEngine, SoundConfig, AudioEventType, SyncPoint } from '@djentronome/core-audio';

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

### Loading from Local Files

```typescript
// Load from a File object (e.g., from a file input)
const file = inputElement.files[0];
await audioEngine.loadFromFile('track', file);

// Load from a URL
await audioEngine.loadFromUrl('track', 'https://example.com/music.mp3');

// Load from an ArrayBuffer
const arrayBuffer = await fetchBinaryData('music.mp3');
await audioEngine.loadFromArrayBuffer('track', arrayBuffer, 'music.mp3', AudioFormat.MP3);
```

### Synchronizing with Game Events

```typescript
// Define sync points at specific times in the audio
const syncPoints: SyncPoint[] = [
  { id: 'beat-1', time: 1.0, triggered: false },
  { id: 'beat-2', time: 2.0, triggered: false },
  { id: 'beat-3', time: 3.0, triggered: false }
];

// Listen for sync events
audioEngine.addEventListener(AudioEventType.SYNC, (event) => {
  const syncPoint = event.data?.syncPoint;
  if (syncPoint) {
    console.log(`Sync point triggered: ${syncPoint.id} at ${syncPoint.time}s`);
    // Trigger game event, animation, etc.
  }
});

// Play sound with sync points
const instanceId = audioEngine.playSound('track', { syncPoints });
```

### Event System

```typescript
// Listen for audio events
audioEngine.addEventListener(AudioEventType.PLAY, (event) => {
  console.log(`Sound ${event.soundId} started playing`);
});

audioEngine.addEventListener(AudioEventType.END, (event) => {
  console.log(`Sound ${event.soundId} finished playing`);
});

// Remove event listener when done
audioEngine.removeEventListener(AudioEventType.PLAY, myListenerFunction);
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
- `loadFromFile(id: string, file: File)`: Load a sound from a File object
- `loadFromUrl(id: string, url: string)`: Load a sound from a URL
- `loadFromArrayBuffer(id: string, buffer: ArrayBuffer, filename: string, format: AudioFormat)`: Load a sound from an ArrayBuffer
- `playSound(id: string, options?: Partial<SoundConfig>)`: Play a sound
- `pauseSound(instanceId: string)`: Pause a specific sound instance
- `resumeSound(instanceId: string)`: Resume a paused sound instance
- `stopSound(instanceId: string)`: Stop a specific sound instance
- `setMasterVolume(volume: number)`: Set the master volume (0-1)
- `getMasterVolume()`: Get the current master volume
- `setEnabled(enabled: boolean)`: Enable or disable audio
- `isEnabled()`: Check if audio is enabled
- `addEventListener(type: AudioEventType, listener: AudioEventListener)`: Add an event listener
- `removeEventListener(type: AudioEventType, listener: AudioEventListener)`: Remove an event listener
- `getAudioInfo(id: string)`: Get metadata about a loaded sound
- `dispose()`: Clean up resources

### `SoundConfig`

Configuration for a sound file.

```typescript
interface SoundConfig {
  src: string;       // Path to the audio file
  volume?: number;   // Volume level (0-1)
  loop?: boolean;    // Whether to loop the sound
  playbackRate?: number; // Playback rate (1 = normal)
  syncPoints?: SyncPoint[]; // Points for game event synchronization
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

### `AudioEventType`

Types of audio events that can be listened for.

```typescript
enum AudioEventType {
  LOAD = 'load',   // Sound loaded
  PLAY = 'play',   // Sound started playing
  PAUSE = 'pause', // Sound paused
  RESUME = 'resume', // Sound resumed
  STOP = 'stop',   // Sound stopped
  END = 'end',     // Sound finished playing
  SYNC = 'sync',   // Sync point reached
  ERROR = 'error'  // Error occurred
}
```

### `SyncPoint`

Definition of a synchronization point in the audio.

```typescript
interface SyncPoint {
  id: string;      // Unique identifier for the sync point
  time: number;    // Time in seconds when the sync point should trigger
  triggered: boolean; // Whether the sync point has been triggered
  data?: any;      // Optional data to include with the sync event
}
``` 