import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Transcriber, TranscriptionElement } from './transcriber';
import { AudioEngine } from './index';

/**
 * Unit tests for the Transcriber class
 * Test type: Unit
 */
describe('Transcriber', () => {
  let transcriber: Transcriber;
  let mockAudioEngine: AudioEngine;
  let mockAnalyzer: AnalyserNode;
  let mockAudioBuffer: AudioBuffer;
  
  beforeEach(() => {
    // Create mock AudioBuffer
    mockAudioBuffer = {
      duration: 30,
      length: 10000,
      numberOfChannels: 2,
      sampleRate: 44100,
      getChannelData: vi.fn().mockReturnValue(new Float32Array(1000))
    } as unknown as AudioBuffer;
    
    // Create mock AudioEngine
    mockAudioEngine = {
      getAudioInfo: vi.fn().mockReturnValue({
        name: 'test.mp3',
        format: 'mp3',
        size: 1024,
        duration: 30,
        source: 'file'
      }),
      
      // Mock other methods as needed
      initialize: vi.fn(),
      loadSound: vi.fn(),
      playSound: vi.fn(),
      stopSound: vi.fn()
    } as unknown as AudioEngine;
    
    // Mock AudioEngine internals (private properties we access)
    (mockAudioEngine as any).context = {
      createAnalyser: vi.fn().mockReturnValue({
        fftSize: 2048,
        getByteFrequencyData: vi.fn(),
        getByteTimeDomainData: vi.fn(),
        connect: vi.fn()
      }),
      currentTime: 0
    };
    (mockAudioEngine as any).soundBuffers = new Map();
    (mockAudioEngine as any).soundBuffers.set('test-track', mockAudioBuffer);
    
    // Create mock AnalyserNode
    mockAnalyzer = {
      fftSize: 2048,
      getByteFrequencyData: vi.fn(),
      getByteTimeDomainData: vi.fn(),
      connect: vi.fn()
    } as unknown as AnalyserNode;
    
    // Create Transcriber instance
    transcriber = new Transcriber(mockAudioEngine);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
    transcriber.dispose();
  });
  
  it('should create a Transcriber instance', () => {
    expect(transcriber).toBeInstanceOf(Transcriber);
  });
  
  it('should initialize successfully', async () => {
    const result = await transcriber.initialize();
    expect(result).toBe(true);
    
    // Verify that the analyzer was created
    const mockContext = (mockAudioEngine as any).context;
    expect(mockContext.createAnalyser).toHaveBeenCalled();
  });
  
  it('should fail initialization if context is not available', async () => {
    // Remove context to simulate error condition
    (mockAudioEngine as any).context = null;
    
    const result = await transcriber.initialize();
    expect(result).toBe(false);
  });
  
  it('should transcribe audio and detect BPM', async () => {
    // Initialize first
    await transcriber.initialize();
    
    // Mock the private methods to control the results
    vi.spyOn(transcriber as any, 'detectBpm').mockReturnValue({
      bpm: 120,
      confidence: 0.9
    });
    
    vi.spyOn(transcriber as any, 'generateBeatMarkers').mockReturnValue(
      [0, 0.5, 1.0, 1.5, 2.0]
    );
    
    // Call transcribe
    const result = await transcriber.transcribe('test-track');
    
    // Verify result
    expect(result).not.toBeNull();
    if (result) {
      expect(result.bpm).toBe(120);
      expect(result.bpmConfidence).toBe(0.9);
      expect(result.duration).toBe(30);
      
      // Check that beat markers were generated
      expect(result.markers[TranscriptionElement.BEAT]).toHaveLength(5);
    }
  });
  
  it('should detect different percussion elements', async () => {
    // Initialize first
    await transcriber.initialize();
    
    // Mock the private methods
    vi.spyOn(transcriber as any, 'detectBpm').mockReturnValue({
      bpm: 120,
      confidence: 0.9
    });
    
    // Spy on detectTransients to verify it's called
    const detectTransientsSpy = vi.spyOn(transcriber as any, 'detectTransients');
    
    // Call transcribe with all elements
    const result = await transcriber.transcribe('test-track', {
      elements: [
        TranscriptionElement.KICK, 
        TranscriptionElement.SNARE,
        TranscriptionElement.HIHAT,
        TranscriptionElement.TRANSIENT,
        TranscriptionElement.BEAT
      ]
    });
    
    // Verify detectTransients was called
    expect(detectTransientsSpy).toHaveBeenCalled();
    
    // Verify result has all elements
    expect(result).not.toBeNull();
    if (result) {
      expect(result.markers[TranscriptionElement.KICK]).toBeDefined();
      expect(result.markers[TranscriptionElement.SNARE]).toBeDefined();
      expect(result.markers[TranscriptionElement.HIHAT]).toBeDefined();
      expect(result.markers[TranscriptionElement.TRANSIENT]).toBeDefined();
      expect(result.markers[TranscriptionElement.BEAT]).toBeDefined();
    }
  });
  
  it('should return null if transcriber is not initialized', async () => {
    // Do not initialize
    
    const result = await transcriber.transcribe('test-track');
    expect(result).toBeNull();
  });
  
  it('should return null if audio is not found', async () => {
    // Initialize
    await transcriber.initialize();
    
    // Mock getAudioInfo to return null
    vi.spyOn(mockAudioEngine, 'getAudioInfo').mockReturnValue(null);
    
    const result = await transcriber.transcribe('nonexistent-track');
    expect(result).toBeNull();
  });
  
  it('should clean up resources when disposed', async () => {
    // Initialize
    await transcriber.initialize();
    
    // Verify analyzer was created
    expect((transcriber as any).analyzer).not.toBeNull();
    
    // Dispose
    transcriber.dispose();
    
    // Verify resources were cleaned up
    expect((transcriber as any).analyzer).toBeNull();
    expect((transcriber as any).audioContext).toBeNull();
  });
}); 