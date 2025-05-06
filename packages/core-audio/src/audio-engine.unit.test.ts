import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AudioEngine, SoundConfig, AudioFormat } from './index';
import * as fileLoaderModule from './file-loader';

/**
 * Unit tests for the AudioEngine class
 * Test type: Unit
 */
describe('AudioEngine', () => {
  let audioEngine: AudioEngine;
  
  // Mock the FileLoader class methods
  beforeEach(() => {
    // Create mock buffer result
    const mockBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn()
    };
    
    // Mock file loader methods
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
    
    // Mock fetch
    global.fetch = vi.fn().mockResolvedValue({
      arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(0)),
      ok: true,
      status: 200,
      statusText: 'OK'
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

  it('should initialize the audio context and file loader', async () => {
    await audioEngine.initialize();
    expect(global.AudioContext).toHaveBeenCalled();
    expect(fileLoaderModule.FileLoader).toHaveBeenCalled();
  });

  it('should load a sound from URL', async () => {
    await audioEngine.initialize();
    
    const soundConfig: SoundConfig = {
      src: 'test.mp3'
    };
    
    const result = await audioEngine.loadSound('test', soundConfig);
    expect(result).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith('test.mp3');
  });
  
  it('should load a sound from a File object', async () => {
    await audioEngine.initialize();
    
    const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
    const result = await audioEngine.loadFromFile('file-test', mockFile);
    
    expect(result).toBe(true);
    
    // Get a reference to the mocked FileLoader instance
    const fileLoaderInstance = (audioEngine as any).fileLoader;
    expect(fileLoaderInstance.loadFromFile).toHaveBeenCalledWith(mockFile);
    
    // Check that audio info can be retrieved
    const info = audioEngine.getAudioInfo('file-test');
    expect(info).toBeDefined();
    expect(info?.name).toBe('test.mp3');
  });
  
  it('should load a sound from a URL using FileLoader', async () => {
    await audioEngine.initialize();
    
    const result = await audioEngine.loadFromUrl('url-test', 'https://example.com/test.mp3');
    
    expect(result).toBe(true);
    
    // Get a reference to the mocked FileLoader instance
    const fileLoaderInstance = (audioEngine as any).fileLoader;
    expect(fileLoaderInstance.loadFromUrl).toHaveBeenCalledWith('https://example.com/test.mp3', undefined);
    
    // Check that audio info can be retrieved
    const info = audioEngine.getAudioInfo('url-test');
    expect(info).toBeDefined();
    expect(info?.source).toBe(fileLoaderModule.AudioSource.URL);
  });
  
  it('should load a sound from an ArrayBuffer', async () => {
    await audioEngine.initialize();
    
    const mockArrayBuffer = new ArrayBuffer(10);
    const result = await audioEngine.loadFromArrayBuffer('buffer-test', mockArrayBuffer, 'test.mp3', AudioFormat.MP3);
    
    expect(result).toBe(true);
    
    // Get a reference to the mocked FileLoader instance
    const fileLoaderInstance = (audioEngine as any).fileLoader;
    expect(fileLoaderInstance.loadFromArrayBuffer).toHaveBeenCalledWith(mockArrayBuffer, 'test.mp3', AudioFormat.MP3);
    
    // Check that audio info can be retrieved
    const info = audioEngine.getAudioInfo('buffer-test');
    expect(info).toBeDefined();
    expect(info?.source).toBe(fileLoaderModule.AudioSource.BUFFER);
  });

  it('should play, pause, and resume a sound', async () => {
    await audioEngine.initialize();
    
    // First, load a mock sound
    const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
    await audioEngine.loadFromFile('test', mockFile);
    
    // Mock context currentTime
    const mockContext = (audioEngine as any).context;
    Object.defineProperty(mockContext, 'currentTime', { value: 10, writable: true });
    
    // Play sound
    const instanceId = audioEngine.playSound('test');
    expect(instanceId).not.toBeNull();
    
    if (instanceId) {
      // Update current time to simulate playback
      Object.defineProperty(mockContext, 'currentTime', { value: 15, writable: true });
      
      // Pause sound
      const pauseResult = audioEngine.pauseSound(instanceId);
      expect(pauseResult).toBe(true);
      
      // Resume sound
      const resumeResult = audioEngine.resumeSound(instanceId);
      expect(resumeResult).toBe(true);
      
      // Stop sound
      const stopResult = audioEngine.stopSound(instanceId);
      expect(stopResult).toBe(true);
    }
  });
  
  it('should resume the audio context', async () => {
    await audioEngine.initialize();
    
    // Mock suspended state
    const mockContext = (audioEngine as any).context;
    
    // Change state to suspended and then make sure resume returns true
    Object.defineProperty(mockContext, 'state', { 
      get: vi.fn().mockReturnValueOnce('suspended').mockReturnValueOnce('running')
    });
    
    // Call resume
    const result = await audioEngine.resumeContext();
    
    // Verify resume was called
    expect(mockContext.resume).toHaveBeenCalled();
    
    // Check result
    expect(result).toBe(true);
  });
  
  it('should get current time from the audio context', async () => {
    await audioEngine.initialize();
    
    // Mock context currentTime
    const mockContext = (audioEngine as any).context;
    Object.defineProperty(mockContext, 'currentTime', { value: 42, writable: true });
    
    // Get current time
    const time = audioEngine.getCurrentTime();
    expect(time).toBe(42);
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
  
  it('should clean up resources when disposed', async () => {
    await audioEngine.initialize();
    
    // Access private fields for testing
    const context = (audioEngine as any).context;
    
    audioEngine.dispose();
    
    expect(context.close).toHaveBeenCalled();
    expect((audioEngine as any).context).toBeNull();
    expect((audioEngine as any).masterGainNode).toBeNull();
    expect((audioEngine as any).fileLoader).toBeNull();
    expect((audioEngine as any).soundBuffers.size).toBe(0);
    expect((audioEngine as any).activeSounds.size).toBe(0);
    expect((audioEngine as any).localAudio.size).toBe(0);
  });
}); 