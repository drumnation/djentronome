import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, SoundConfig } from './index';

/**
 * Unit tests for the AudioEngine class
 * Test type: Unit
 */
describe('AudioEngine', () => {
  let audioEngine: AudioEngine;
  
  // Mock Audio Context and related Web Audio API components
  beforeEach(() => {
    // Mock AudioContext
    global.AudioContext = vi.fn().mockImplementation(() => ({
      createGain: vi.fn().mockReturnValue({
        gain: { value: 1 },
        connect: vi.fn()
      }),
      createBufferSource: vi.fn().mockReturnValue({
        buffer: null,
        loop: false,
        playbackRate: { value: 1 },
        connect: vi.fn(),
        start: vi.fn(),
        stop: vi.fn(),
        onended: null
      }),
      destination: {},
      decodeAudioData: vi.fn().mockResolvedValue({}),
      close: vi.fn()
    }));
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0))
    });
    
    // Create AudioEngine with default options
    audioEngine = new AudioEngine();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    audioEngine.dispose();
  });

  it('should create an AudioEngine instance', () => {
    expect(audioEngine).toBeInstanceOf(AudioEngine);
    expect(audioEngine.isEnabled()).toBe(true);
    expect(audioEngine.getMasterVolume()).toBe(1.0);
  });

  it('should initialize the audio context', async () => {
    await audioEngine.initialize();
    expect(global.AudioContext).toHaveBeenCalled();
  });

  it('should load a sound', async () => {
    await audioEngine.initialize();
    
    const soundConfig: SoundConfig = {
      src: 'test.mp3'
    };
    
    const result = await audioEngine.loadSound('test', soundConfig);
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('test.mp3');
  });

  it('should set and get master volume', () => {
    audioEngine.setMasterVolume(0.5);
    expect(audioEngine.getMasterVolume()).toBe(0.5);
    
    // Test clamping to valid range
    audioEngine.setMasterVolume(-1);
    expect(audioEngine.getMasterVolume()).toBe(0);
    
    audioEngine.setMasterVolume(2);
    expect(audioEngine.getMasterVolume()).toBe(1);
  });

  it('should enable and disable audio', () => {
    expect(audioEngine.isEnabled()).toBe(true);
    
    audioEngine.setEnabled(false);
    expect(audioEngine.isEnabled()).toBe(false);
    
    audioEngine.setEnabled(true);
    expect(audioEngine.isEnabled()).toBe(true);
  });

  it('should not play a sound that has not been loaded', async () => {
    await audioEngine.initialize();
    
    const instanceId = audioEngine.playSound('nonexistent');
    expect(instanceId).toBeNull();
  });
}); 