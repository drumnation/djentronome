import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, AudioFormat, AudioSource } from './index';
import { GameLoop } from '../../game-loop/src';
import { AudioGameIntegration, AudioGameIntegrationConfig } from './audio-game-integration';
import { SyncEventType } from './game-sync';

/**
 * Unit tests for the AudioGameIntegration module
 * Test type: Unit
 */
describe('AudioGameIntegration', () => {
  let audioEngine: AudioEngine;
  let gameLoop: GameLoop;
  let audioGameIntegration: AudioGameIntegration;
  
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
    
    // Mock performance.now
    vi.spyOn(performance, 'now').mockReturnValue(0);
    
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
    
    // Create a GameLoop with mock update function
    const update = vi.fn();
    gameLoop = new GameLoop({ update });
    vi.spyOn(gameLoop, 'start').mockImplementation(() => {});
    vi.spyOn(gameLoop, 'stop').mockImplementation(() => {});
    vi.spyOn(gameLoop, 'isRunning').mockReturnValue(false);
    
    // Create config
    const config: AudioGameIntegrationConfig = {
      autoStartAudio: false,
      autoStopAudio: true,
      bpmSync: { bpm: 120 },
      audioId: 'test-sound'
    };
    
    // Create AudioGameIntegration
    audioGameIntegration = new AudioGameIntegration(gameLoop, audioEngine, config);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    audioEngine.dispose();
  });
  
  it('should initialize with correct config', () => {
    const bpmConfig = audioGameIntegration.getBPMConfig();
    expect(bpmConfig.bpm).toBe(120);
    expect(bpmConfig.beatsPerBar).toBe(4);
  });
  
  it('should start game loop on integration start', () => {
    audioGameIntegration.start();
    
    expect(gameLoop.start).toHaveBeenCalled();
  });
  
  it('should play audio with auto start', () => {
    // Create integration with auto start enabled
    const configWithAutoStart: AudioGameIntegrationConfig = {
      autoStartAudio: true,
      bpmSync: { bpm: 120 },
      audioId: 'test-sound'
    };
    
    const integrationWithAutoStart = new AudioGameIntegration(
      gameLoop, 
      audioEngine, 
      configWithAutoStart
    );
    
    // Start integration
    integrationWithAutoStart.start();
    
    // Expect audio to be played automatically
    expect(audioEngine.playSoundWithSync).toHaveBeenCalled();
  });
  
  it('should play audio explicitly', () => {
    // Start without auto-play
    audioGameIntegration.start();
    expect(audioEngine.playSoundWithSync).not.toHaveBeenCalled();
    
    // Now play audio explicitly
    const instanceId = audioGameIntegration.playAudio('test-sound', { volume: 0.8 });
    
    // Verify audio was played with options
    expect(instanceId).toBe('test-instance-id');
    expect(audioEngine.playSoundWithSync).toHaveBeenCalledWith(
      'test-sound',
      { volume: 0.8 },
      expect.any(Array)
    );
  });
  
  it('should stop audio playback', () => {
    // Play audio
    audioGameIntegration.playAudio('test-sound');
    
    // Stop audio
    const result = audioGameIntegration.stopAudio();
    
    // Verify stop was called
    expect(result).toBe(true);
    expect(audioEngine.stopSound).toHaveBeenCalledWith('test-instance-id');
  });
  
  it('should change BPM configuration', () => {
    // Change BPM
    audioGameIntegration.setBPMConfig({ bpm: 140, beatsPerBar: 3 });
    
    // Verify BPM was changed
    const config = audioGameIntegration.getBPMConfig();
    expect(config.bpm).toBe(140);
    expect(config.beatsPerBar).toBe(3);
  });
  
  it('should register and dispatch rhythm events', () => {
    // Get the GameAudioSync instance
    const gameAudioSync = audioGameIntegration.getGameAudioSync();
    
    // Spy on addEventListener
    const addEventListenerSpy = vi.spyOn(gameAudioSync, 'addEventListener');
    
    // Register a rhythm event listener
    const beatListener = vi.fn();
    audioGameIntegration.addRhythmEventListener(SyncEventType.BEAT, beatListener);
    
    // Verify listener was registered
    expect(addEventListenerSpy).toHaveBeenCalledWith(SyncEventType.BEAT, beatListener);
  });
  
  it('should remove rhythm event listeners', () => {
    // Get the GameAudioSync instance
    const gameAudioSync = audioGameIntegration.getGameAudioSync();
    
    // Spy on removeEventListener
    const removeEventListenerSpy = vi.spyOn(gameAudioSync, 'removeEventListener');
    
    // Create a listener
    const beatListener = vi.fn();
    
    // Add and then remove the listener
    audioGameIntegration.addRhythmEventListener(SyncEventType.BEAT, beatListener);
    audioGameIntegration.removeRhythmEventListener(SyncEventType.BEAT, beatListener);
    
    // Verify listener was removed
    expect(removeEventListenerSpy).toHaveBeenCalledWith(SyncEventType.BEAT, beatListener);
  });
  
  it('should get beat position correctly', () => {
    // Get the GameAudioSync instance
    const gameAudioSync = audioGameIntegration.getGameAudioSync();
    
    // Spy on getBeatPosition
    const getBeatPositionSpy = vi.spyOn(gameAudioSync, 'getBeatPosition').mockReturnValue({
      bar: 2,
      beat: 3,
      phase: 0.5
    });
    
    // Get beat position
    const position = audioGameIntegration.getBeatPosition();
    
    // Verify position was retrieved
    expect(getBeatPositionSpy).toHaveBeenCalled();
    expect(position).toEqual({
      bar: 2,
      beat: 3,
      phase: 0.5
    });
  });
  
  it('should patch the game loop update function', () => {
    // The patching happens in constructor, so let's verify the game loop's
    // update function was replaced with our wrapped version
    
    // Call the patched update function directly (accessing private property)
    const patchedUpdate = (gameLoop as any).update;
    expect(typeof patchedUpdate).toBe('function');
    
    // Call it and verify it doesn't error
    expect(() => patchedUpdate(0.016)).not.toThrow();
  });
}); 