import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FileLoader, AudioSource } from './file-loader';
import * as path from 'path';

/**
 * Unit tests for audio file loading
 * Test type: Unit
 */
describe('FileLoader', () => {
  let fileLoader: FileLoader;
  
  beforeEach(() => {
    // Mock the AudioContext
    global.AudioContext = vi.fn().mockImplementation(() => ({
      decodeAudioData: vi.fn().mockImplementation((_) => {
        return Promise.resolve({
          duration: 30,
          numberOfChannels: 2,
          sampleRate: 44100
        });
      })
    })) as any;
    
    fileLoader = new FileLoader();
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  describe('loadFromFile', () => {
    it('should load audio from a File object', async () => {
      // Create a mock File
      const mockFile = new File(['test'], 'test.mp3', { type: 'audio/mp3' });
      
      // Mock the readFileAsArrayBuffer method
      vi.spyOn(fileLoader as any, 'readFileAsArrayBuffer').mockResolvedValue(new ArrayBuffer(10));
      
      // Call method
      const result = await fileLoader.loadFromFile(mockFile);
      
      // Verify result
      expect((fileLoader as any).readFileAsArrayBuffer).toHaveBeenCalledWith(mockFile);
      expect(global.AudioContext.decodeAudioData).toHaveBeenCalled();
      expect(result.buffer).toBeDefined();
      expect(result.info.name).toBe('test.mp3');
      expect(result.info.format).toBe(AudioFormat.MP3);
      expect(result.info.source).toBe(AudioSource.FILE);
      expect(result.info.duration).toBe(30);
    });
    
    it('should throw an error for unsupported file types', async () => {
      // Create a mock File with unsupported type
      const mockFile = new File(['test'], 'test.txt', { type: 'text/plain' });
      
      // Expect error
      await expect(fileLoader.loadFromFile(mockFile)).rejects.toThrow('File is not an audio file');
    });
  });
  
  describe('loadFromUrl', () => {
    it('should load audio from a URL', async () => {
      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10))
      });
      
      // Call method
      const result = await fileLoader.loadFromUrl('https://example.com/test.mp3');
      
      // Verify result
      expect(global.fetch).toHaveBeenCalledWith('https://example.com/test.mp3');
      expect(global.AudioContext.decodeAudioData).toHaveBeenCalled();
      expect(result.buffer).toBeDefined();
      expect(result.info.name).toBe('test.mp3');
      expect(result.info.format).toBe(AudioFormat.MP3);
      expect(result.info.source).toBe(AudioSource.URL);
      expect(result.info.duration).toBe(30);
    });
    
    it('should use provided filename when available', async () => {
      // Mock fetch
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        statusText: 'OK',
        arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(10))
      });
      
      // Call method with custom filename
      const result = await fileLoader.loadFromUrl('https://example.com/test.mp3', 'custom.mp3');
      
      // Verify result
      expect(result.info.name).toBe('custom.mp3');
    });
    
    it('should throw an error when fetch fails', async () => {
      // Mock fetch failure
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        arrayBuffer: vi.fn()
      });
      
      // Expect error
      await expect(fileLoader.loadFromUrl('https://example.com/test.mp3')).rejects.toThrow('Failed to fetch');
    });
  });
  
  describe('loadFromArrayBuffer', () => {
    it('should load audio from an ArrayBuffer', async () => {
      // Create a mock ArrayBuffer
      const mockArrayBuffer = new ArrayBuffer(10);
      
      // Call method
      const result = await fileLoader.loadFromArrayBuffer(mockArrayBuffer, 'test.mp3', AudioFormat.MP3);
      
      // Verify result
      expect(global.AudioContext.decodeAudioData).toHaveBeenCalledWith(mockArrayBuffer);
      expect(result.buffer).toBeDefined();
      expect(result.info.name).toBe('test.mp3');
      expect(result.info.format).toBe(AudioFormat.MP3);
      expect(result.info.source).toBe(AudioSource.BUFFER);
      expect(result.info.duration).toBe(30);
    });
  });
  
  describe('Format detection', () => {
    it('should detect MP3 format from file type', () => {
      // Create mock file with MP3 type
      const mockFile = new File(['test'], 'test.file', { type: 'audio/mp3' });
      
      // Use private method via any cast for testing
      const format = (fileLoader as any).getAudioFormatFromFile(mockFile);
      expect(format).toBe(AudioFormat.MP3);
    });
    
    it('should detect WAV format from file type', () => {
      // Create mock file with WAV type
      const mockFile = new File(['test'], 'test.file', { type: 'audio/wav' });
      
      // Use private method via any cast for testing
      const format = (fileLoader as any).getAudioFormatFromFile(mockFile);
      expect(format).toBe(AudioFormat.WAV);
    });
    
    it('should detect OGG format from file type', () => {
      // Create mock file with OGG type
      const mockFile = new File(['test'], 'test.file', { type: 'audio/ogg' });
      
      // Use private method via any cast for testing
      const format = (fileLoader as any).getAudioFormatFromFile(mockFile);
      expect(format).toBe(AudioFormat.OGG);
    });
    
    it('should detect format from file extension when type is unknown', () => {
      // Create mock file with unknown type but wav extension
      const mockFile = new File(['test'], 'test.wav', { type: 'audio/x-unknown' });
      
      // Use private method via any cast for testing
      const format = (fileLoader as any).getAudioFormatFromFile(mockFile);
      expect(format).toBe(AudioFormat.WAV);
    });
    
    it('should detect format from URL extension', () => {
      // Test different URL formats
      expect((fileLoader as any).getAudioFormatFromUrl('https://example.com/test.wav')).toBe(AudioFormat.WAV);
      expect((fileLoader as any).getAudioFormatFromUrl('https://example.com/test.mp3')).toBe(AudioFormat.MP3);
      expect((fileLoader as any).getAudioFormatFromUrl('https://example.com/test.ogg')).toBe(AudioFormat.OGG);
    });
  });
}); 