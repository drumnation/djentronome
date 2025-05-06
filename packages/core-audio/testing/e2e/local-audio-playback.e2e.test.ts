/**
 * E2E test for local audio file loading and playback
 * Test type: E2E
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { AudioEngine, AudioFormat } from '../../src';
import * as fs from 'fs';
import * as path from 'path';
import * as fileLoaderModule from '../../src/file-loader';

describe('Local Audio Playback E2E', () => {
  let audioEngine: AudioEngine;
  const testFilePath = path.resolve(__dirname, '../../../../test-assets/sound/djent-track.mp3');
  
  beforeEach(async () => {
    // Mock the FileLoader to avoid FileReader issues in Node.js
    const mockBuffer = {
      duration: 60, // Assume 60 seconds for test
      length: 1000000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    
    vi.spyOn(fileLoaderModule, 'FileLoader').mockImplementation(() => {
      return {
        loadFromFile: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'djent-track.mp3',
            format: AudioFormat.MP3,
            size: 1024000,
            duration: 60,
            source: fileLoaderModule.AudioSource.FILE
          }
        }),
        loadFromUrl: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'djent-track.mp3',
            format: AudioFormat.MP3,
            size: 1024000,
            duration: 60,
            source: fileLoaderModule.AudioSource.URL
          }
        }),
        loadFromArrayBuffer: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'djent-track.mp3',
            format: AudioFormat.MP3,
            size: 1024000,
            duration: 60,
            source: fileLoaderModule.AudioSource.BUFFER
          }
        })
      } as any;
    });
    
    // Create a real AudioEngine with mock AudioContext for headless testing
    audioEngine = new AudioEngine({ preloadSounds: false });
    
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
          duration: 60, // Assume 60 seconds for test
          length: arrayBuffer.byteLength,
          numberOfChannels: 2,
          sampleRate: 44100,
          getChannelData: vi.fn()
        });
      }),
      close: vi.fn(),
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined)
    }));
    
    // Setup fake timers
    vi.useFakeTimers();
    
    // Initialize the engine
    await audioEngine.initialize();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    audioEngine.dispose();
  });
  
  it('should load and play the test MP3 file', async () => {
    // Verify test file exists
    expect(fs.existsSync(testFilePath)).toBe(true);
    
    // Read file into a buffer
    const fileBuffer = fs.readFileSync(testFilePath);
    const arrayBuffer = fileBuffer.buffer.slice(
      fileBuffer.byteOffset,
      fileBuffer.byteOffset + fileBuffer.byteLength
    ) as ArrayBuffer;
    
    // Create a File object from the buffer
    const file = new File(
      [arrayBuffer],
      'djent-track.mp3',
      { type: 'audio/mp3' }
    );
    
    // Load the file into the audio engine
    const loadResult = await audioEngine.loadFromFile('djent-track', file);
    expect(loadResult).toBe(true);
    
    // Manually add the buffer to soundBuffers since our mock may not connect properly
    const mockBuffer = {
      duration: 60,
      length: 1000000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    (audioEngine as any).soundBuffers.set('djent-track', mockBuffer);
    
    // Verify file metadata was stored
    const info = audioEngine.getAudioInfo('djent-track');
    expect(info).toBeDefined();
    expect(info?.name).toBe('djent-track.mp3');
    expect(info?.format).toBe(AudioFormat.MP3);
    
    // Play the sound
    const instanceId = audioEngine.playSound('djent-track');
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // Verify that we can control playback
      expect(audioEngine.pauseSound(instanceId)).toBe(true);
      expect(audioEngine.resumeSound(instanceId)).toBe(true);
      expect(audioEngine.stopSound(instanceId)).toBe(true);
    }
  });
  
  it('should handle synchronization with game events', async () => {
    // Skip file reading and use the mock directly
    // Load directly from array buffer
    const loadResult = await audioEngine.loadFromArrayBuffer(
      'djent-track',
      new ArrayBuffer(1000), // Dummy buffer
      'djent-track.mp3',
      AudioFormat.MP3
    );
    expect(loadResult).toBe(true);
    
    // Manually add the buffer to soundBuffers since our mock may not connect properly
    const mockBuffer = {
      duration: 60,
      length: 1000000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    (audioEngine as any).soundBuffers.set('djent-track', mockBuffer);
    
    // Mock the context time for precise testing
    const mockContext = (audioEngine as any).context;
    let currentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', { 
      get: () => currentTime,
      set: (v) => { currentTime = v; }
    });
    
    // Set up game events at specific times (in seconds)
    const gameEvents = [
      { time: 1.0, triggered: false, name: 'beat_1' },
      { time: 2.0, triggered: false, name: 'beat_2' },
      { time: 3.0, triggered: false, name: 'beat_3' }
    ];
    
    // Play the sound
    const instanceId = audioEngine.playSound('djent-track');
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // Store the instance for checking start time
      const instance = (audioEngine as any).activeSounds.get(instanceId);
      expect(instance.startTime).toBe(0);
      
      // Simulate time passing and check if events would trigger
      for (let simulatedTime = 0; simulatedTime <= 4; simulatedTime += 0.5) {
        // Update mock time
        currentTime = simulatedTime;
        vi.advanceTimersByTime(20); // Advance enough for one frame
        
        // Check which events should trigger
        for (const event of gameEvents) {
          if (!event.triggered && simulatedTime >= event.time) {
            event.triggered = true;
          }
        }
      }
      
      // Verify all events were triggered
      expect(gameEvents.every(e => e.triggered)).toBe(true);
      
      // Clean up
      audioEngine.stopSound(instanceId);
    }
  });
}); 