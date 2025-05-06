# Latency Calibration Implementation Notes

## Overview

The Latency Calibration package provides tools for measuring and compensating for input latency in rhythm games. This document explains the key implementation details and design decisions behind the package.

## Architecture

The package is built around a central `LatencyCalibrator` class that manages:

1. **Measuring latency** through a series of input/output tests
2. **Storing calibration data** per device
3. **Retrieving latency offsets** for compensation during gameplay
4. **Managing calibration status** and events

## Design Decisions

### Stateful Class Design

We chose a stateful class-based architecture for the `LatencyCalibrator` to maintain a consistent configuration and device settings throughout a game session. This allows for:

- Persistent settings across game sessions
- Device-specific calibration profiles
- Event-based status reporting

### Event-Based Progress Reporting

Rather than using polling or promises alone, we chose an event-based architecture for reporting calibration progress. This provides:

- Real-time feedback during calibration
- Detailed status information
- Support for updating UI components like progress bars

### Statistical Analysis

The calibration process collects multiple samples and performs statistical analysis to:

- Calculate mean latency
- Determine measurement confidence
- Identify outliers
- Calculate standard deviation

This approach results in more accurate measurements compared to a single sample approach.

### Pluggable Input Methods

The calibrator supports multiple input methods (MIDI, keyboard, audio, etc.) through a simple enum-based configuration. This allows for:

- Support for various peripherals and controllers
- Consistent latency handling across input types
- Future extensibility for new input methods

## Implementation Details

### Sample Collection

Latency samples are collected by:

1. Emitting a signal (audio, visual)
2. Waiting for user input
3. Calculating the time difference
4. Collecting multiple samples with random intervals

### Persistence Strategy

Device settings are persisted using:

1. In-memory storage during a session
2. LocalStorage for persistence between sessions
3. JSON serialization for storage

### Latency Compensation

Latency is compensated by:

1. Retrieving the calibrated offset for a device
2. Subtracting the offset from event timestamps
3. Using the adjusted timestamps for hit detection

## Future Improvements

1. **Automatic Calibration** - Support for automatic calibration using audio analysis
2. **Multiple Signal Types** - Add support for different signal types (visual patterns, different audio tones)
3. **Adaptive Calibration** - Support for recalibration based on performance metrics
4. **Cross-Device Profiles** - Allow users to share calibration profiles between devices

## Testing Strategy

1. **Unit Tests** - Verify core functionality in isolation
2. **Integration Tests** - Test interaction with MIDI devices
3. **Mock Audio Context** - Avoid actual audio playback during tests
4. **Time Mocking** - Use vitest's time mocking capabilities for deterministic tests 