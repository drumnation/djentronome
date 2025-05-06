import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, AudioEventType, AudioFormat, AudioSource, AudioEvent, AudioEventListener } from './index';
import { GameAudioSync, SyncEventType, BPMSyncConfig } from './game-sync';

/**
 * Unit tests for the GameAudioSync module
 * Test type: Unit
 */
describe('GameAudioSync', () => {
  let audioEngine: AudioEngine;
  let gameAudioSync: GameAudioSync;
  
  // Mock audio buffer
  const mockBuffer = {
    duration: 30,
    length: 10000,
    numberOfChannels: 2,
    sampleRate: 44100,
    getChannelData: vi.fn()
  };
  
  beforeEach(async () => {
    // Setup fake timers
    vi.useFakeTimers();
    
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
      decodeAudioData: vi.fn().mockResolvedValue(mockBuffer),
      close: vi.fn(),
      state: 'running',
      currentTime: 0,
      resume: vi.fn().mockResolvedValue(undefined)
    }));
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = vi.fn().mockImplementation((callback) => {
      return setTimeout(callback, 16) as unknown as number;
    });
    
    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = vi.fn().mockImplementation((id) => {
      clearTimeout(id as unknown as NodeJS.Timeout);
    });
    
    // Create a real AudioEngine
    audioEngine = new AudioEngine();
    await audioEngine.initialize();
    
    // Mock AudioEngine methods
    vi.spyOn(audioEngine, 'getAudioInfo').mockReturnValue({
      name: 'test.mp3',
      format: AudioFormat.MP3,
      size: 1024,
      duration: 30,
      source: AudioSource.URL
    });
    
    vi.spyOn(audioEngine, 'playSoundWithSync').mockReturnValue('test-instance-id');
    vi.spyOn(audioEngine, 'stopSound').mockReturnValue(true);
    vi.spyOn(audioEngine, 'getCurrentTime').mockReturnValue(0);
    
    // Add a mock sound buffer for testing
    (audioEngine as any).soundBuffers.set('test-sound', mockBuffer);
    
    // Create a GameAudioSync instance
    const bpmConfig: BPMSyncConfig = { bpm: 120 };
    gameAudioSync = new GameAudioSync(audioEngine, bpmConfig);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    audioEngine.dispose();
  });
  
  it('should initialize with default BPM config', () => {
    expect(gameAudioSync.getBPMConfig()).toEqual({
      bpm: 120,
      beatsPerBar: 4,
      beatUnit: 4,
      offsetSeconds: 0
    });
  });
  
  it('should generate sync points for audio', () => {
    // Start sync playback
    const instanceId = gameAudioSync.startSync('test-sound');
    
    // Verify sync points were generated
    expect(instanceId).toBe('test-instance-id');
    expect(audioEngine.playSoundWithSync).toHaveBeenCalledWith(
      'test-sound',
      {},
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.stringContaining('beat-'),
          time: expect.any(Number),
          triggered: false,
          data: expect.any(Object)
        })
      ])
    );
  });
  
  it('should handle beat position calculations', () => {
    // Start sync playback
    gameAudioSync.startSync('test-sound');
    
    // Mock time progress
    vi.spyOn(audioEngine, 'getCurrentTime').mockReturnValue(2.0); // 2 seconds from start
    
    // At 120 BPM, 2 seconds = 4 beats (assuming start time = 0)
    const beatPosition = gameAudioSync.getBeatPosition();
    
    // Expect to be at bar 1, beat 5 (or bar 2, beat 1 depending on how we handle it)
    expect(beatPosition.bar).toBe(2); // Second bar
    expect(beatPosition.beat).toBe(1); // First beat of second bar
    expect(beatPosition.phase).toBeCloseTo(0, 1); // Just at start of beat
  });
  
  it('should handle time-to-beat conversion', () => {
    // Assuming 120 BPM, 4/4 time
    // Bar 2, beat 3 = 7 beats from start (4 beats in bar 1 + 2 beats in bar 2)
    const timeForBeat = gameAudioSync.getTimeForBeat(2, 3);
    
    // At 120 BPM, each beat is 0.5 seconds
    // So 6 full beats = 3 seconds
    expect(timeForBeat).toBeCloseTo(3, 2);
  });
  
  it('should dispatch rhythm events', () => {
    // Start sync playback
    gameAudioSync.startSync('test-sound');
    
    // Set up event listener
    const beatListener = vi.fn();
    gameAudioSync.addEventListener(SyncEventType.BEAT, beatListener);
    
    // Mock a sync event from audio engine
    const mockSyncEvent: AudioEvent = {
      type: AudioEventType.SYNC,
      time: 1.0,
      instanceId: 'test-instance-id',
      data: {
        syncPoint: {
          id: 'beat-1-1',
          time: 1.0,
          triggered: true,
          data: {
            rhythmEvent: {
              type: SyncEventType.BEAT,
              time: 1.0,
              bar: 1,
              beat: 1,
              division: 1
            }
          }
        }
      }
    };
    
    // Find the sync event listener in the audio engine
    const listeners = (audioEngine as any).eventListeners.get(AudioEventType.SYNC);
    if (listeners && listeners.size > 0) {
      // Get the first listener (should be the GameAudioSync one)
      const syncListener = Array.from(listeners)[0] as AudioEventListener;
      // Dispatch the event
      syncListener(mockSyncEvent);
    }
    
    // Verify our beat listener was called
    expect(beatListener).toHaveBeenCalledWith(expect.objectContaining({
      type: SyncEventType.BEAT,
      time: 1.0,
      bar: 1,
      beat: 1
    }));
  });
  
  it('should update BPM config', () => {
    // Change BPM
    const newBPMConfig: BPMSyncConfig = { 
      bpm: 140, 
      beatsPerBar: 3, 
      beatUnit: 8 
    };
    
    gameAudioSync.setBPMConfig(newBPMConfig);
    
    // Verify config was updated
    const config = gameAudioSync.getBPMConfig();
    expect(config.bpm).toBe(140);
    expect(config.beatsPerBar).toBe(3);
    expect(config.beatUnit).toBe(8);
  });
  
  it('should calculate tempo in milliseconds', () => {
    // At 120 BPM, one beat is 500ms
    expect(gameAudioSync.getMillisecondsPerBeat()).toBe(500);
    
    // Change to 60 BPM
    gameAudioSync.setBPMConfig({ bpm: 60 });
    
    // At 60 BPM, one beat is 1000ms
    expect(gameAudioSync.getMillisecondsPerBeat()).toBe(1000);
  });
  
  it('should handle stop sync correctly', () => {
    // Start sync playback
    gameAudioSync.startSync('test-sound');
    
    // Stop sync
    const result = gameAudioSync.stopSync();
    
    // Verify stop was called
    expect(result).toBe(true);
    expect(audioEngine.stopSound).toHaveBeenCalledWith('test-instance-id');
  });
}); 