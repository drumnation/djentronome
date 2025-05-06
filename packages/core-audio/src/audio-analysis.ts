/**
 * Audio Analysis Module
 * 
 * This file re-exports the audio analysis functionality from the modular implementation.
 * For better maintainability, the implementation has been split into specialized modules:
 * - frequency-analyzer.ts: For frequency domain analysis
 * - waveform-analyzer.ts: For time domain waveform extraction
 * - beat-detector.ts: For beat/onset detection
 */

export * from './audio-analysis/index'; 