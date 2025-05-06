import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, AudioEventType, SyncPoint, AudioEvent } from './index';
import * as fileLoaderModule from './file-loader';

/**
 * Unit tests for the AudioEngine event system
 * Test type: Unit
 */
describe('AudioEngine Event System', () => {
  let audioEngine: AudioEngine;
  
  beforeEach(async () => {
    // Setup fake timers
    vi.useFakeTimers();
    
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
            format: { toString: () => 'mp3' },
            size: 1024,
            duration: 30,
            source: 'file'
          }
        }),
        loadFromUrl: vi.fn().mockResolvedValue({
          buffer: mockBuffer,
          info: {
            name: 'test.mp3',
            format: { toString: () => 'mp3' },
            size: 1024,
            duration: 30,
            source: 'url'
          }
        })
      } as any;
    });
    
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
        onended: vi.fn(),
        dispatchEvent: vi.fn()
      }),
      destination: {},
      decodeAudioData: vi.fn().mockResolvedValue({
        duration: 30,
        length: 10000,
        numberOfChannels: 2,
        sampleRate: 44100,
        getChannelData: vi.fn()
      }),
      close: vi.fn(),
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined)
    }));
    
    // Mock window.requestAnimationFrame
    global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      return setTimeout(callback, 16) as unknown as number; // ~60fps
    });
    
    // Mock window.cancelAnimationFrame
    global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
    
    // Create a real AudioEngine
    audioEngine = new AudioEngine();
    
    // Initialize the engine
    await audioEngine.initialize();
    
    // Add a mock sound buffer for testing
    (audioEngine as any).soundBuffers.set('test-sound', {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    });
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    audioEngine.dispose();
  });
  
  it('should register and trigger event listeners', async () => {
    // Create event listener spy
    const listener = vi.fn();
    
    // Register listener for play events
    audioEngine.addEventListener(AudioEventType.PLAY, listener);
    
    // Play a sound
    const instanceId = audioEngine.playSound('test-sound');
    expect(instanceId).not.toBeNull();
    
    // Check that the event was dispatched
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(expect.objectContaining({
      type: AudioEventType.PLAY,
      soundId: 'test-sound',
      instanceId
    }));
    
    // Play another sound
    const instanceId2 = audioEngine.playSound('test-sound');
    expect(instanceId2).not.toBeNull();
    
    // Check that the event was dispatched again
    expect(listener).toHaveBeenCalledTimes(2);
    
    // Remove the listener
    audioEngine.removeEventListener(AudioEventType.PLAY, listener);
    
    // Play a third sound
    audioEngine.playSound('test-sound');
    
    // Check that the event was not dispatched again (still at 2)
    expect(listener).toHaveBeenCalledTimes(2);
  });
  
  it('should handle multiple event types', async () => {
    // Create event listener spies
    const playListener = vi.fn();
    const pauseListener = vi.fn();
    const stopListener = vi.fn();
    
    // Register listeners
    audioEngine.addEventListener(AudioEventType.PLAY, playListener);
    audioEngine.addEventListener(AudioEventType.PAUSE, pauseListener);
    audioEngine.addEventListener(AudioEventType.STOP, stopListener);
    
    // Play a sound
    const instanceId = audioEngine.playSound('test-sound');
    expect(instanceId).not.toBeNull();
    
    // Check that the play event was dispatched
    expect(playListener).toHaveBeenCalledTimes(1);
    expect(pauseListener).not.toHaveBeenCalled();
    expect(stopListener).not.toHaveBeenCalled();
    
    if (instanceId) {
      // Pause the sound
      audioEngine.pauseSound(instanceId);
      
      // Check that the pause event was dispatched
      expect(playListener).toHaveBeenCalledTimes(1);
      expect(pauseListener).toHaveBeenCalledTimes(1);
      expect(stopListener).not.toHaveBeenCalled();
      
      // Resume the sound
      audioEngine.resumeSound(instanceId);
      
      // Stop the sound
      audioEngine.stopSound(instanceId);
      
      // Check that the stop event was dispatched
      expect(playListener).toHaveBeenCalledTimes(1);
      expect(pauseListener).toHaveBeenCalledTimes(1);
      expect(stopListener).toHaveBeenCalledTimes(1);
    }
  });
  
  it('should handle sync points', async () => {
    // Create sync listener spy
    const syncListener = vi.fn();
    
    // Register listener for sync events
    audioEngine.addEventListener(AudioEventType.SYNC, syncListener);
    
    // Define sync points
    const syncPoints: SyncPoint[] = [
      { id: 'beat-1', time: 1.0, triggered: false },
      { id: 'beat-2', time: 2.0, triggered: false },
      { id: 'beat-3', time: 3.0, triggered: false }
    ];
    
    // Mock the context currentTime to manipulate
    const mockContext = (audioEngine as any).context;
    let currentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', { 
      get: () => currentTime,
      set: (v) => { currentTime = v; }
    });
    
    // Play sound with sync points
    const instanceId = audioEngine.playSoundWithSync('test-sound', {}, syncPoints);
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // First, verify no sync events have triggered yet
      expect(syncListener).not.toHaveBeenCalled();
      
      // Test with time = 0.5 (before first sync)
      currentTime = 0.5;
      vi.advanceTimersByTime(20); // Advance enough for one frame
      
      // Check that no sync events were triggered yet
      expect(syncListener).not.toHaveBeenCalled();
      
      // Test with time = 1.5 (after first sync point)
      currentTime = 1.5;
      vi.advanceTimersByTime(20);
      
      // Check that the first sync event was triggered
      expect(syncListener).toHaveBeenCalledTimes(1);
      
      // Test with time = 3.5 (after all sync points)
      currentTime = 3.5;
      vi.advanceTimersByTime(20);
      
      // Check that all three sync events were triggered
      expect(syncListener).toHaveBeenCalledTimes(3);
      
      // Extract the sync points from the calls to verify order
      const event1 = syncListener.mock.calls[0][0];
      const event2 = syncListener.mock.calls[1][0];
      const event3 = syncListener.mock.calls[2][0];
      
      // Assert that the sync points were triggered in order
      expect(event1.data?.syncPoint?.id).toBe('beat-1');
      expect(event2.data?.syncPoint?.id).toBe('beat-2');
      expect(event3.data?.syncPoint?.id).toBe('beat-3');
    }
  });
  
  it('should add sync points to playing sounds', async () => {
    // Create sync listener spy
    const syncListener = vi.fn();
    
    // Register listener for sync events
    audioEngine.addEventListener(AudioEventType.SYNC, syncListener);
    
    // Mock the context currentTime
    const mockContext = (audioEngine as any).context;
    let currentTime = 0;
    Object.defineProperty(mockContext, 'currentTime', { 
      get: () => currentTime,
      set: (v) => { currentTime = v; }
    });
    
    // Play sound without sync points
    const instanceId = audioEngine.playSound('test-sound');
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // Add a sync point at time 2.0
      const syncPoint: SyncPoint = { id: 'added-beat', time: 2.0, triggered: false };
      const added = audioEngine.addSyncPoint(instanceId, syncPoint);
      expect(added).toBe(true);
      
      // Move to time 2.5 (after the sync point)
      currentTime = 2.5;
      vi.advanceTimersByTime(20);
      
      // Check that the sync event was triggered
      expect(syncListener).toHaveBeenCalledTimes(1);
      const event = syncListener.mock.calls[0][0];
      expect(event.data?.syncPoint?.id).toBe('added-beat');
    }
  });
}); 