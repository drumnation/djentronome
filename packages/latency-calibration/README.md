# Latency Calibration

A package for measuring and compensating for input latency in rhythm games.

## Purpose

The `@djentronome/latency-calibration` package provides tools for:

- Measuring input latency for various input methods (MIDI, keyboard, audio, etc.)
- Storing calibration data per device
- Applying latency compensation to make gameplay more accurate
- Providing a user-friendly calibration interface

## Features

- Multiple input method support (MIDI, keyboard, audio, touch, gamepad)
- Statistical analysis for accurate latency measurement
- Persistent settings storage
- Event-based progress reporting
- Configurable test parameters

## Installation

```bash
pnpm add @djentronome/latency-calibration
```

## Usage

### Basic Usage

```typescript
import { LatencyCalibrator, InputMethod } from '@djentronome/latency-calibration';

// Create a calibrator instance
const calibrator = new LatencyCalibrator();

// Get stored offset for a device (0 if not calibrated)
const offset = calibrator.getOffset('my-midi-device-id');

// Apply the offset to a timestamp
const correctedTime = timestamp - offset;
```

### Calibration Process

```typescript
import { LatencyCalibrator, InputMethod, CalibrationStatus } from '@djentronome/latency-calibration';

// Create a calibrator with custom options
const calibrator = new LatencyCalibrator({
  autoSave: true, // Auto-save to localStorage after calibration
  autoLoad: true, // Auto-load from localStorage on initialization
  defaultTestConfig: {
    sampleCount: 10, // Number of samples to collect
    inputMethod: InputMethod.MIDI,
    useAudio: true, // Use audio cues
    useVisual: true, // Use visual cues
  }
});

// Add status listener for progress updates
calibrator.addStatusListener((event) => {
  console.log(`Calibration status: ${event.status}`);
  console.log(`Progress: ${event.progress * 100}%`);
  
  if (event.status === CalibrationStatus.FAILED) {
    console.error(`Calibration failed: ${event.error}`);
  }
});

// Start calibration
try {
  const result = await calibrator.calibrate('device-id', 'My MIDI Device');
  console.log(`Measured latency: ${result.latency}ms`);
  console.log(`Confidence: ${result.confidence}`);
} catch (error) {
  console.error('Calibration failed:', error);
}
```

### Custom Test Configuration

```typescript
calibrator.setTestConfig({
  sampleCount: 15, // More samples for higher accuracy
  minConfidence: 0.9, // Minimum required confidence
  maxStandardDeviation: 5, // Maximum allowed standard deviation (ms)
  interval: 2000, // Time between samples (ms)
  intervalVariation: 500, // Random variation in interval (ms)
  sampleTimeout: 3000, // Timeout for each sample (ms)
});
```

## API Reference

### `LatencyCalibrator`

Main class for handling latency calibration and compensation.

#### Constructor

```typescript
new LatencyCalibrator(options?: LatencyCalibratorOptions)
```

#### Methods

- `getStatus()`: Get current calibration status
- `getOffset(deviceId: string)`: Get latency offset for a device
- `getDeviceSettings(deviceId: string)`: Get full settings for a device
- `calibrate(deviceId: string, deviceName: string)`: Start the calibration process
- `setTestConfig(config: Partial<LatencyTestConfig>)`: Update test configuration
- `addStatusListener(listener: CalibrationStatusListener)`: Add a status event listener
- `removeStatusListener(listener: CalibrationStatusListener)`: Remove a status listener
- `clearDeviceSettings()`: Clear all device settings
- `loadSettings()`: Load settings from storage
- `saveSettings()`: Save settings to storage

## Testing

This package includes both unit tests and integration tests:

### Unit Tests

Unit tests focus on the core functionality of the `LatencyCalibrator` class:

```bash
pnpm test
```

### Integration Tests

Integration tests verify how the latency calibrator works with MIDI events:

```bash
pnpm vitest run testing/integration/latency-calibrator-midi.integration.test.ts
```

## Development

To set up the development environment:

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Run tests:
   ```bash
   pnpm test
   ```

3. Build the package:
   ```bash
   pnpm build
   ```

## License

MIT 