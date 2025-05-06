/**
 * Audio Analysis Module
 * 
 * Provides a comprehensive set of tools for analyzing audio data
 * by composing specialized analyzers for frequency, waveform, and beat detection.
 */

import { FrequencyAnalyzer, type FrequencyAnalysisOptions, type FrequencyAnalysisResult } from './frequency-analyzer';
import { WaveformAnalyzer, type WaveformExtractionOptions, type WaveformData } from './waveform-analyzer';
import { BeatDetector, type BeatDetectionOptions, type BeatDetectionResult } from './beat-detector';

// Re-export interfaces from the specialized analyzers
export type {
  FrequencyAnalysisOptions, 
  FrequencyAnalysisResult,
  WaveformExtractionOptions,
  WaveformData,
  BeatDetectionOptions,
  BeatDetectionResult
};

/**
 * Main audio analyzer that composes specialized analyzers
 */
export class AudioAnalyzer {
  private frequencyAnalyzer: FrequencyAnalyzer;
  private waveformAnalyzer: WaveformAnalyzer;
  private beatDetector: BeatDetector;
  
  /**
   * Create a new audio analyzer
   */
  constructor(audioContext: AudioContext) {
    this.frequencyAnalyzer = new FrequencyAnalyzer(audioContext);
    this.waveformAnalyzer = new WaveformAnalyzer();
    this.beatDetector = new BeatDetector();
  }
  
  /**
   * Get the analyzer node for real-time analysis
   */
  getAnalyserNode(): AnalyserNode {
    return this.frequencyAnalyzer.getAnalyserNode();
  }
  
  /**
   * Connect a node to the analyzer for real-time analysis
   */
  connectSource(sourceNode: AudioNode): AudioNode {
    return this.frequencyAnalyzer.connectSource(sourceNode);
  }
  
  /**
   * Set FFT size for frequency analysis
   */
  setFftSize(fftSize: number): void {
    this.frequencyAnalyzer.setFftSize(fftSize);
  }
  
  /**
   * Analyze frequency data from an audio buffer
   */
  analyzeFrequency(audioBuffer: AudioBuffer, options: FrequencyAnalysisOptions = {}): FrequencyAnalysisResult {
    return this.frequencyAnalyzer.analyzeBuffer(audioBuffer, options);
  }
  
  /**
   * Extract waveform data from an audio buffer
   */
  extractWaveform(audioBuffer: AudioBuffer, options: WaveformExtractionOptions = {}): WaveformData {
    return this.waveformAnalyzer.extractWaveform(audioBuffer, options);
  }
  
  /**
   * Detect beats in an audio buffer
   */
  detectBeats(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): BeatDetectionResult {
    return this.beatDetector.detectBeats(audioBuffer, options);
  }
  
  /**
   * Get amplitude statistics from an audio buffer
   */
  getAmplitudeStats(audioBuffer: AudioBuffer, channel: number = 0): { 
    min: number;
    max: number;
    peak: number;
    rms: number;
    crest: number;
  } {
    return this.waveformAnalyzer.getAmplitudeStats(audioBuffer, channel);
  }
  
  /**
   * Calculate loudness profile over time
   */
  getLoudnessProfile(audioBuffer: AudioBuffer, segmentDuration: number = 0.1): { 
    times: Float32Array;
    loudness: Float32Array;
  } {
    return this.waveformAnalyzer.getLoudnessProfile(audioBuffer, segmentDuration);
  }
  
  /**
   * Estimate BPM using autocorrelation method
   */
  estimateBpm(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): number {
    return this.beatDetector.estimateBpmUsingAutocorrelation(audioBuffer, options);
  }
  
  /**
   * Detect rhythmic pattern (e.g., 4/4, 3/4)
   */
  detectRhythmicPattern(audioBuffer: AudioBuffer, options: BeatDetectionOptions = {}): {
    timeSignature: string;
    subdivisions: number[][];
  } {
    return this.beatDetector.detectRhythmicPattern(audioBuffer, options);
  }
  
  /**
   * Get real-time frequency data from analyzer node
   */
  getRealtimeFrequencyData(): Float32Array {
    return this.frequencyAnalyzer.getRealtimeFrequencyData();
  }
  
  /**
   * Get the frequencies represented by each bin
   */
  getFrequencyBins(): number[] {
    return this.frequencyAnalyzer.getFrequencyBins();
  }
} 