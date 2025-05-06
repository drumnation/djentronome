/**
 * Integration test for audio transcription
 * Test type: Integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, AudioFormat } from '../../src';
import { Transcriber, TranscriptionElement } from '../../src/transcriber';
import * as fileLoaderModule from '../../src/file-loader';

describe('Audio Transcription Integration', () => {
  let audioEngine: AudioEngine;
  let transcriber: Transcriber;
  
  beforeEach(async () => {
    // Mock audio context and file loader for testing in Node.js
    // where browser audio APIs aren't available
    mockBrowserAudio();
    
    // Initialize real components
    audioEngine = new AudioEngine();
    await audioEngine.initialize();
    
    transcriber = new Transcriber(audioEngine);
    await transcriber.initialize();
    
    // Load some test audio
    await loadTestAudio();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    transcriber.dispose();
    audioEngine.dispose();
  });
  
  it('should transcribe loaded audio and detect beats', async () => {
    // Transcribe the test audio
    const result = await transcriber.transcribe('test-rhythm');
    
    // Verify basic properties
    expect(result).not.toBeNull();
    if (result) {
      expect(result.bpm).toBeGreaterThan(0);
      expect(result.bpmConfidence).toBeGreaterThan(0);
      expect(result.duration).toBeGreaterThan(0);
      
      // Verify that beat markers were created
      expect(result.markers[TranscriptionElement.BEAT].length).toBeGreaterThan(0);
    }
  });
  
  it('should detect kick and snare patterns', async () => {
    // Transcribe with kick and snare detection
    const result = await transcriber.transcribe('test-rhythm', {
      elements: [TranscriptionElement.KICK, TranscriptionElement.SNARE]
    });
    
    // Verify that markers were created for both elements
    expect(result).not.toBeNull();
    if (result) {
      expect(result.markers[TranscriptionElement.KICK].length).toBeGreaterThan(0);
      expect(result.markers[TranscriptionElement.SNARE].length).toBeGreaterThan(0);
      
      // Snares are typically less frequent than kicks in most patterns
      expect(result.markers[TranscriptionElement.KICK].length).toBeGreaterThanOrEqual(
        result.markers[TranscriptionElement.SNARE].length
      );
    }
  });
  
  it('should provide consistent results for the same audio', async () => {
    // Run transcription twice on the same content
    const result1 = await transcriber.transcribe('test-rhythm');
    const result2 = await transcriber.transcribe('test-rhythm');
    
    // Verify that both results are valid
    expect(result1).not.toBeNull();
    expect(result2).not.toBeNull();
    
    if (result1 && result2) {
      // BPM should be exactly the same
      expect(result2.bpm).toBe(result1.bpm);
      
      // Beat markers should have same length and values
      expect(result2.markers[TranscriptionElement.BEAT].length)
        .toBe(result1.markers[TranscriptionElement.BEAT].length);
      
      // Compare first few markers (should be exact)
      const beats1 = result1.markers[TranscriptionElement.BEAT].slice(0, 5);
      const beats2 = result2.markers[TranscriptionElement.BEAT].slice(0, 5);
      expect(beats2).toEqual(beats1);
    }
  });
  
  it('should handle different BPM ranges', async () => {
    // Transcribe with different BPM range constraint
    const result = await transcriber.transcribe('test-rhythm', {
      bpmRange: { min: 80, max: 100 }
    });
    
    expect(result).not.toBeNull();
    if (result) {
      // BPM should be constrained within the requested range
      expect(result.bpm).toBeGreaterThanOrEqual(80);
      expect(result.bpm).toBeLessThanOrEqual(100);
    }
  });
  
  // Helper functions
  
  /**
   * Mock browser audio APIs for testing in Node.js
   */
  function mockBrowserAudio() {
    // Mock AudioBuffer
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn().mockReturnValue(new Float32Array(1000))
    };
    
    // Mock FileLoader
    vi.spyOn(fileLoaderModule, 'FileLoader').mockImplementation(() => {
      return {
        loadFromFile: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'test.mp3',
            format: AudioFormat.MP3,
            size: 1024,
            duration: 30,
            source: fileLoaderModule.AudioSource.FILE
          }
        }),
        loadFromUrl: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'test.mp3',
            format: AudioFormat.MP3,
            size: 1024,
            duration: 30,
            source: fileLoaderModule.AudioSource.URL
          }
        })
      } as any;
    });
    
    // Mock browser AudioContext
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
      createAnalyser: vi.fn().mockReturnValue({
        fftSize: 2048,
        frequencyBinCount: 1024,
        minDecibels: -100,
        maxDecibels: -30,
        smoothingTimeConstant: 0.8,
        getByteFrequencyData: vi.fn().mockImplementation((array) => {
          // Simulate frequency data with a peak in the low-mid range (kick drum)
          for (let i = 0; i < array.length; i++) {
            // Create a peak around the bass frequencies
            if (i < 100) {
              array[i] = 200 - i * 2;
            } else {
              array[i] = Math.max(0, 50 - Math.floor(i / 20));
            }
          }
        }),
        getByteTimeDomainData: vi.fn().mockImplementation((array) => {
          // Simulate waveform data with a few transients
          for (let i = 0; i < array.length; i++) {
            // Create transients at regular intervals
            if (i % 100 < 10) {
              array[i] = 200 + Math.floor(Math.random() * 55);
            } else {
              array[i] = 128 + Math.floor(Math.random() * 20 - 10);
            }
          }
        }),
        connect: vi.fn()
      }),
      destination: {},
      decodeAudioData: vi.fn().mockImplementation((arrayBuffer) => {
        return Promise.resolve(mockBuffer);
      }),
      close: vi.fn(),
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined)
    }));
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10)),
      ok: true,
      status: 200,
      statusText: 'OK'
    });
    
    // Mock File
    global.File = vi.fn().mockImplementation((bits, name, options) => {
      return {
        name,
        type: options.type,
        size: bits.reduce((acc, bit) => acc + bit.length, 0)
      };
    }) as any;
  }
  
  /**
   * Load test audio files
   */
  async function loadTestAudio() {
    // Create a mock rhythm track
    const mockFile = new File(['test'], 'rhythm.mp3', { type: 'audio/mp3' });
    await audioEngine.loadFromFile('test-rhythm', mockFile);
    
    // Create mock buffer directly and inject it into the engine
    // This is a workaround since our mocked FileLoader doesn't
    // actually connect with the soundBuffers Map in AudioEngine
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn().mockImplementation(() => {
        // Simulate audio data with periodic transients
        const data = new Float32Array(10000);
        for (let i = 0; i < data.length; i++) {
          // Create peaks at regular intervals (like a metronome)
          if (i % 1000 < 50) {
            data[i] = 0.9; // Peak
          } else {
            data[i] = Math.random() * 0.1 - 0.05; // Slight noise
          }
        }
        return data;
      })
    };
    
    // Manually set the buffer in the engine
    (audioEngine as any).soundBuffers.set('test-rhythm', mockBuffer);
  }
}); 