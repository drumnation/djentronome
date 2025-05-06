# Audio Transcription Module

## Overview
The audio transcription module provides beat detection and rhythm analysis capabilities for audio files. It analyzes loaded audio to identify rhythmic elements including beats, kick drums, snares, and hi-hats. This module works in conjunction with the AudioEngine to process audio files that have already been loaded.

## Key Features
- BPM (tempo) detection with confidence metric
- Beat marker generation at regular intervals
- Drum hit detection (kick, snare, hi-hat)
- Transient detection for any percussive element
- Configurable sensitivity and BPM range

## Implementation Details
The transcription module uses the Web Audio API's `AnalyserNode` to perform frequency and time-domain analysis on audio data. The core algorithm processes the audio in chunks to:

1. **Detect tempo (BPM)** through onset detection and autocorrelation
2. **Generate beat markers** at regular intervals based on the detected tempo
3. **Identify drum hits** by analyzing the frequency content:
   - Kick drums: Strong low-frequency energy (20-120Hz)
   - Snare drums: Mid-frequency energy with noise (120-300Hz + high frequency noise)
   - Hi-hats: High-frequency content (5000Hz+)

The current implementation provides a foundation that can be extended with more sophisticated algorithms as needed.

## Usage / API

```typescript
// Initialize the audio engine
const audioEngine = new AudioEngine();
await audioEngine.initialize();

// Load an audio file
const file = fileInputElement.files[0];
await audioEngine.loadFromFile('drum-loop', file);

// Create and initialize the transcriber
const transcriber = new Transcriber(audioEngine);
await transcriber.initialize();

// Perform basic transcription
const result = await transcriber.transcribe('drum-loop');
console.log(`Detected BPM: ${result.bpm}`);
console.log(`Number of beats: ${result.markers[TranscriptionElement.BEAT].length}`);

// Perform custom transcription
const customResult = await transcriber.transcribe('drum-loop', {
  elements: [TranscriptionElement.KICK, TranscriptionElement.SNARE],
  sensitivity: 0.7,
  bpmRange: { min: 80, max: 160 }
});

// Work with detected markers
customResult.markers[TranscriptionElement.KICK].forEach(time => {
  console.log(`Kick drum at ${time.toFixed(2)}s`);
});

// Clean up when done
transcriber.dispose();
audioEngine.dispose();
```

## Technical Implementation Notes

### Transcriber Class
The `Transcriber` class requires an initialized `AudioEngine` instance and creates an analyzer node that can process audio data from the engine.

### TranscriptionResult
Results contain the detected BPM, confidence level, and a map of markers for each detected element (kicks, snares, etc.).

### Configuration Options
- `elements`: Array of elements to detect (KICK, SNARE, HIHAT, BEAT, TRANSIENT)
- `detectBpm`: Whether to automatically detect BPM (default: true)
- `sensitivity`: Detection sensitivity from 0-1 (default: 0.5)
- `bpmRange`: Expected BPM range for detection (default: 60-200)

## Limitations & Future Improvements

### Current Limitations
- Simplified detection algorithms that work best on clear, well-defined rhythms
- Fixed FFT size that may not be optimal for all audio content
- Only detects basic drum elements, not melodic components or complex percussion

### Planned Improvements
- Machine learning-based drum hit classification
- Support for complex time signatures beyond 4/4
- Melody and chord progression detection
- Enhanced BPM detection using multiple algorithms
- Integration with MIDI output for transcription export

## Integration with Game Systems
The transcription module is designed to integrate with game systems by:

1. Providing accurate timing information for rhythm-based gameplay
2. Enabling automatic difficulty generation based on detected patterns
3. Supporting dynamic game element generation synchronized with music
4. Allowing for score tracking based on player timing relative to detected beats 