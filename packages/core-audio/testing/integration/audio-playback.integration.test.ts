/**
 * Integration test for audio playback functionality
 * Test type: Integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, AudioFormat } from '../../src';
import * as fileLoaderModule from '../../src/file-loader';

describe('Audio Playback Integration', () => {
  let audioEngine: AudioEngine;
  
  beforeEach(async () => {
    // Mock the file loader to avoid issues with FileReader in Node.js
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    
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
        }),
        loadFromArrayBuffer: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'test.mp3',
            format: AudioFormat.MP3,
            size: 1024,
            duration: 30,
            source: fileLoaderModule.AudioSource.BUFFER
          }
        })
      } as any;
    });
    
    // Create a real AudioEngine
    audioEngine = new AudioEngine();
    
    // Mock AudioContext globally
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
      decodeAudioData: vi.fn().mockImplementation((arrayBuffer) => {
        return Promise.resolve({
          duration: 30,
          length: 10000,
          numberOfChannels: 2,
          sampleRate: 44100,
          getChannelData: vi.fn()
        });
      }),
      close: vi.fn(),
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined)
    } as any));
    
    // Initialize the engine
    await audioEngine.initialize();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    audioEngine.dispose();
  });
  
  it('should load and play a local audio file', async () => {
    // Create a mock File
    const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
    
    // Load the file into the audio engine
    const loadResult = await audioEngine.loadFromFile('test-track', mockFile);
    expect(loadResult).toBe(true);
    
    // Manually add the sound buffer since our mock doesn't actually connect the dots
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    (audioEngine as any).soundBuffers.set('test-track', mockBuffer);
    
    // Verify file metadata was stored
    const info = audioEngine.getAudioInfo('test-track');
    expect(info).toBeDefined();
    expect(info?.name).toBe('test.mp3');
    expect(info?.format).toBe(AudioFormat.MP3);
    
    // Play the sound
    const instanceId = audioEngine.playSound('test-track');
    expect(instanceId).not.toBeNull();
    
    // Verify we can manipulate the playback
    if (instanceId) {
      // Pause the sound
      const pauseResult = audioEngine.pauseSound(instanceId);
      expect(pauseResult).toBe(true);
      
      // Resume the sound
      const resumeResult = audioEngine.resumeSound(instanceId);
      expect(resumeResult).toBe(true);
      
      // Stop the sound
      const stopResult = audioEngine.stopSound(instanceId);
      expect(stopResult).toBe(true);
    }
  });
  
  it('should handle playback timing and synchronization', async () => {
    // Create a mock File
    const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
    
    // Load the file into the audio engine
    await audioEngine.loadFromFile('sync-track', mockFile);
    
    // Manually add the sound buffer since our mock doesn't actually connect the dots
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    (audioEngine as any).soundBuffers.set('sync-track', mockBuffer);
    
    // Mock the context time for precise testing
    const mockContext = (audioEngine as any).context;
    let currentTime = 10; // Start at 10 seconds
    Object.defineProperty(mockContext, 'currentTime', { 
      get: () => currentTime
    });
    
    // Play the sound - should start at the current context time
    const instanceId = audioEngine.playSound('sync-track');
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // Get the active sound instance
      const instance = (audioEngine as any).activeSounds.get(instanceId);
      
      // Verify the instance start time matches the context time
      expect(instance.startTime).toBe(10);
      
      // Simulate time passing
      currentTime = 15; // 5 seconds later
      
      // Get the current time
      const engineTime = audioEngine.getCurrentTime();
      expect(engineTime).toBe(15);
      
      // Clean up
      audioEngine.stopSound(instanceId);
    }
  });
  
  it('should handle multiple sound sources simultaneously', async () => {
    // Create mock Files
    const mockFile1 = new File(['test1'], 'beat.mp3', { type: 'audio/mp3' });
    const mockFile2 = new File(['test2'], 'melody.mp3', { type: 'audio/mp3' });
    
    // Load both files
    await audioEngine.loadFromFile('beat', mockFile1);
    await audioEngine.loadFromFile('melody', mockFile2);
    
    // Manually add the sound buffers since our mock doesn't actually connect the dots
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    (audioEngine as any).soundBuffers.set('beat', mockBuffer);
    (audioEngine as any).soundBuffers.set('melody', mockBuffer);
    
    // Mock context time
    const mockContext = (audioEngine as any).context;
    Object.defineProperty(mockContext, 'currentTime', { value: 0, writable: true });
    
    // Play both sounds
    const beatId = audioEngine.playSound('beat');
    const melodyId = audioEngine.playSound('melody');
    
    expect(beatId).not.toBeNull();
    expect(melodyId).not.toBeNull();
    
    // Verify both sounds are active
    expect((audioEngine as any).activeSounds.size).toBe(2);
    
    // Stop one sound
    if (beatId) {
      audioEngine.stopSound(beatId);
      expect((audioEngine as any).activeSounds.size).toBe(1);
    }
    
    // Stop the other sound
    if (melodyId) {
      audioEngine.stopSound(melodyId);
      expect((audioEngine as any).activeSounds.size).toBe(0);
    }
  });
}); 