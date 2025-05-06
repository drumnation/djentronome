import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine } from '../../core-audio/src';
import { Metronome, MetronomeConfig } from './metronome';

// Mock the AudioEngine
vi.mock('../../core-audio/src', () => {
  return {
    AudioEngine: vi.fn().mockImplementation(() => ({
      initialize: vi.fn().mockResolvedValue(undefined),
      loadSound: vi.fn().mockResolvedValue(true),
      playSound: vi.fn().mockReturnValue('sound-id'),
      stopSound: vi.fn().mockReturnValue(true),
      dispose: vi.fn()
    }))
  };
});

describe('Metronome', () => {
  let audioEngine: AudioEngine;
  let metronome: Metronome;
  let defaultConfig: MetronomeConfig;

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks();
    
    // Create a new audio engine for each test
    audioEngine = new AudioEngine();
    
    // Default configuration for tests
    defaultConfig = {
      tempo: 120,
      beatsPerMeasure: 4,
      beatUnit: 4,
      subdivision: 1,
      tripletFeel: false
    };
    
    // Create a new metronome
    metronome = new Metronome(audioEngine, defaultConfig);
    
    // Mock window setInterval and clearInterval
    vi.stubGlobal('setInterval', vi.fn().mockReturnValue(123));
    vi.stubGlobal('clearInterval', vi.fn());
    
    // Mock performance.now
    vi.stubGlobal('performance', {
      now: vi.fn().mockReturnValue(1000)
    });
  });

  afterEach(() => {
    // Restore mocks
    vi.unstubAllGlobals();
  });

  it('should initialize with default config', () => {
    const metronome = new Metronome(audioEngine);
    expect(metronome).toBeDefined();
    
    const config = metronome.getConfig();
    expect(config.tempo).toBe(120);
    expect(config.beatsPerMeasure).toBe(4);
    expect(config.beatUnit).toBe(4);
    expect(config.subdivision).toBe(1);
    expect(config.tripletFeel).toBe(false);
  });

  it('should load sounds successfully', async () => {
    const result = await metronome.loadSounds();
    expect(result).toBe(true);
    expect(audioEngine.loadSound).toHaveBeenCalledTimes(4);
  });

  it('should start the metronome', () => {
    metronome.start();
    expect(metronome.isActive()).toBe(true);
    expect(window.setInterval).toHaveBeenCalled();
  });

  it('should stop the metronome', () => {
    metronome.start();
    metronome.stop();
    expect(metronome.isActive()).toBe(false);
    expect(window.clearInterval).toHaveBeenCalledWith(123);
  });

  it('should update configuration', () => {
    const newConfig: Partial<MetronomeConfig> = {
      tempo: 160,
      beatsPerMeasure: 3,
      tripletFeel: true
    };
    
    metronome.updateConfig(newConfig);
    
    const config = metronome.getConfig();
    expect(config.tempo).toBe(160);
    expect(config.beatsPerMeasure).toBe(3);
    expect(config.tripletFeel).toBe(true);
    expect(config.beatUnit).toBe(4); // Unchanged
    expect(config.subdivision).toBe(1); // Unchanged
  });

  it('should restart metronome if playing when updating config', () => {
    metronome.start();
    
    const stopSpy = vi.spyOn(metronome, 'stop');
    const startSpy = vi.spyOn(metronome, 'start');
    
    metronome.updateConfig({ tempo: 160 });
    
    expect(stopSpy).toHaveBeenCalled();
    expect(startSpy).toHaveBeenCalled();
  });

  it('should calculate correct subdivision count for regular feel', () => {
    // Test with regular 4/4 and quarter note subdivision
    let metronome = new Metronome(audioEngine, {
      ...defaultConfig,
      subdivision: 1,
      tripletFeel: false
    });
    
    // Using private method via any
    expect((metronome as any).getSubdivisionCount()).toBe(1);
    
    // Test with regular 4/4 and eighth note subdivision
    metronome = new Metronome(audioEngine, {
      ...defaultConfig,
      subdivision: 2,
      tripletFeel: false
    });
    
    expect((metronome as any).getSubdivisionCount()).toBe(2);
  });

  it('should calculate correct subdivision count for triplet feel', () => {
    // Test with triplet 4/4 and quarter note subdivision
    let metronome = new Metronome(audioEngine, {
      ...defaultConfig,
      subdivision: 1,
      tripletFeel: true
    });
    
    // Should be 3 subdivisions per beat for triplet feel
    expect((metronome as any).getSubdivisionCount()).toBe(3);
    
    // Test with triplet 4/4 and eighth note subdivision
    metronome = new Metronome(audioEngine, {
      ...defaultConfig,
      subdivision: 2,
      tripletFeel: true
    });
    
    // Should be 6 subdivisions per beat for triplet eighth notes
    expect((metronome as any).getSubdivisionCount()).toBe(6);
  });
}); 