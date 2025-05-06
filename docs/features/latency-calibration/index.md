# Latency Calibration in Djentronome

## Overview

Accurate timing is critical for rhythm games. Even small amounts of latency can significantly impact gameplay and scoring. The `@djentronome/latency-calibration` package provides a comprehensive solution for measuring and compensating for input latency in the Djentronome application.

## Role in the Game Architecture

The latency calibration module serves several key functions in the Djentronome architecture:

1. **Input Device Profiling**: Creates calibration profiles for different input devices (MIDI drum kits, keyboards, gamepads).

2. **Latency Compensation**: Adjusts input timestamps to account for measured latency, ensuring accurate hit detection.

3. **Calibration UI**: Provides a user-friendly interface for players to calibrate their setup.

4. **Settings Management**: Persists calibration settings between game sessions.

## Integration with Other Packages

The latency calibration system integrates with several other core packages:

- **core-midi**: Receives MIDI events that need latency compensation
- **rhythm-engine**: Applies latency offsets to inputs before hit detection
- **game-state**: Stores calibration settings as part of the game configuration
- **ui**: Provides calibration interface components

## Calibration Process

The calibration workflow for players consists of:

1. **Setup**: Player selects their input device and launches the calibration tool
2. **Sampling**: Player responds to visual/audio cues multiple times
3. **Analysis**: System calculates the average latency and confidence level
4. **Confirmation**: Player confirms the calibration or retries
5. **Application**: Latency offset is applied to all future inputs

## Technical Implementation

The core `LatencyCalibrator` class handles:

- Statistical analysis of multiple input samples
- Calculation of confidence intervals
- Storage and retrieval of device-specific settings
- Progress event emitting for UI updates

See the [implementation notes](../../packages/latency-calibration/docs/implementation-notes.md) for detailed technical information.

## Future Enhancements

Planned improvements to the latency calibration system include:

- **Automatic Audio Analysis**: Using audio input to automatically detect latency
- **Per-Pad Calibration**: For MIDI drums, allowing different offsets for each pad
- **Environmental Adaptation**: Automatic recalibration based on system load or audio configuration changes
- **Calibration Profiles**: Allowing players to save and switch between multiple calibration profiles 