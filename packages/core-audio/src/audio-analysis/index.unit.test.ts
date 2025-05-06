/**
 * Unit tests for the AudioAnalyzer class
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AudioAnalyzer } from './index';

describe('AudioAnalyzer', () => {
  let audioContext: AudioContext;
  let analyzer: AudioAnalyzer;
  let audioBuffer: AudioBuffer;

  beforeEach(() => {
    // Mock AudioContext and related Web Audio API objects
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createAnalyser: vi.fn().mockReturnValue({
        fftSize: 2048,
        frequencyBinCount: 1024,
        smoothingTimeConstant: 0.8,
        getFloatFrequencyData: vi.fn(),
        connect: vi.fn()
      }),
      sampleRate: 44100
    }));

    global.OfflineAudioContext = vi.fn().mockImplementation(() => ({
      createAnalyser: vi.fn().mockReturnValue({
        fftSize: 2048,
        frequencyBinCount: 1024,
        smoothingTimeConstant: 0.8,
        getFloatFrequencyData: vi.fn()
      }),
      createBufferSource: vi.fn().mockReturnValue({
        buffer: null,
        connect: vi.fn(),
        start: vi.fn()
      }),
      startRendering: vi.fn().mockResolvedValue({})
    }));

    // Create mock audio buffer
    audioBuffer = {
      duration: 10,
      length: 441000, // 10 seconds at 44.1kHz
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn().mockReturnValue(new Float32Array(441000).fill(0.5))
    } as unknown as AudioBuffer;

    audioContext = new AudioContext();
    analyzer = new AudioAnalyzer(audioContext);
  });

  it('should create an instance with required components', () => {
    expect(analyzer).toBeDefined();
    expect(analyzer.getAnalyserNode).toBeDefined();
    expect(analyzer.analyzeFrequency).toBeDefined();
    expect(analyzer.extractWaveform).toBeDefined();
    expect(analyzer.detectBeats).toBeDefined();
  });

  it('should connect audio nodes for analysis', () => {
    const sourceNode = { connect: vi.fn() } as unknown as AudioNode;
    const result = analyzer.connectSource(sourceNode);
    
    expect(sourceNode.connect).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should extract waveform data from audio buffer', () => {
    const waveform = analyzer.extractWaveform(audioBuffer);
    
    expect(waveform).toBeDefined();
    expect(waveform.data).toBeInstanceOf(Float32Array);
    expect(waveform.times).toBeInstanceOf(Float32Array);
    expect(waveform.peak).toBeGreaterThan(0);
    expect(waveform.duration).toBe(10);
  });

  it('should analyze frequency data from audio buffer', () => {
    const freqData = analyzer.analyzeFrequency(audioBuffer);
    
    expect(freqData).toBeDefined();
    expect(freqData.frequencies).toBeInstanceOf(Array);
    expect(freqData.magnitudes).toBeInstanceOf(Array);
    expect(freqData.normalizedMagnitudes).toBeInstanceOf(Array);
  });

  it('should detect beats from audio buffer', () => {
    const beats = analyzer.detectBeats(audioBuffer);
    
    expect(beats).toBeDefined();
    expect(beats.bpm).toBeGreaterThan(0);
    expect(beats.beats).toBeInstanceOf(Array);
  });

  it('should estimate BPM using autocorrelation', () => {
    const bpm = analyzer.estimateBpm(audioBuffer);
    
    expect(bpm).toBeGreaterThan(0);
  });
}); 