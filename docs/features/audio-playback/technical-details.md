# Technical Details: Audio Playback (Local Files)

## Overview
The audio playback feature provides a robust system for loading, playing, and controlling audio files in the Djentronome game. It supports loading audio from multiple sources (local files, URLs, and ArrayBuffers), playback control (play, pause, resume, stop), and precise synchronization with game events through the Web Audio API.

## Key Design Decisions & Rationale
* **Factory Pattern for Audio Loading**: We implemented a separate `FileLoader` class that handles loading audio from different sources, providing a clean separation of concerns between loading and playback.
  * Rationale: This makes the codebase more maintainable and extensible for supporting additional audio sources in the future.

* **State Management for Playback Instances**: Each audio playback instance maintains its own state ('playing', 'paused', 'stopped') and related metadata.
  * Rationale: This allows for precise control over individual sounds and makes implementing features like pause/resume straightforward.

* **Precise Timing with AudioContext**: We utilize the Web Audio API's `AudioContext.currentTime` for accurate scheduling.
  * Rationale: Game audio, especially for rhythm games, requires precise timing that setTimeout/setInterval can't reliably provide.

* **Resource Management**: The implementation automatically cleans up resources when sounds finish playing or are stopped.
  * Rationale: Prevents memory leaks and ensures optimal performance, especially when many sounds are played in sequence.

## Implementation Notes
* The `AudioEngine` class is the main entry point for audio functionality
* The `FileLoader` class handles loading from different sources
* All audio data is decoded into AudioBuffers for efficient playback
* We store metadata about loaded audio files separately from the audio buffers
* Playback timing is based on the AudioContext clock for precise synchronization
* The engine handles resuming the AudioContext after user interaction automatically

## Usage / API
```typescript
// Initialize the audio engine
const audioEngine = new AudioEngine();
await audioEngine.initialize();

// Load audio from a File object (e.g., from file input)
const file = fileInputElement.files[0];
await audioEngine.loadFromFile('my-music', file);

// Load audio from a URL
await audioEngine.loadFromUrl('background-music', 'assets/sounds/background.mp3');

// Play a loaded sound
const instanceId = audioEngine.playSound('my-music');

// Control playback
audioEngine.pauseSound(instanceId);
audioEngine.resumeSound(instanceId);
audioEngine.stopSound(instanceId);

// Get information about loaded audio
const info = audioEngine.getAudioInfo('my-music');
console.log(`Duration: ${info.duration} seconds`);

// Set volume
audioEngine.setMasterVolume(0.5); // 50% volume

// Clean up when done
audioEngine.dispose();
```

## Gotchas / Known Issues
* **Browser Autoplay Policies**: Most browsers require a user gesture before playing audio. Always call `audioEngine.resumeContext()` after a user interaction.
* **Mobile Audio Limitations**: Some mobile browsers have restrictions on audio playback or may unload audio when the app is in the background.
* **Format Support**: Different browsers support different audio formats. It's best to provide MP3 files which have the widest support.
* **Performance**: Be cautious when loading many large audio files, as this can consume significant memory. Consider unloading unused audio when no longer needed.
* **Timing Precision**: While Web Audio API provides high-precision timing, there can still be small variations in actual output timing due to the audio hardware and OS. Critical rhythm game components may need calibration mechanisms. 