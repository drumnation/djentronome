import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BufferManager, StreamingStatus } from './index';

// Mock the window object before tests
vi.stubGlobal('window', {
  setInterval: vi.fn(),
  clearInterval: vi.fn()
});

/**
 * Unit tests for the BufferManager
 * Test type: Unit
 */
describe('BufferManager (Modular)', () => {
  let bufferManager: BufferManager;
  
  // Mock audio buffer creation helper
  const createMockBuffer = (channels: number, samples: number): AudioBuffer => {
    return {
      length: samples,
      duration: samples / 44100,
      numberOfChannels: channels,
      sampleRate: 44100,
      getChannelData: vi.fn(() => new Float32Array(samples)),
      copyFromChannel: vi.fn(),
      copyToChannel: vi.fn()
    } as unknown as AudioBuffer;
  };
  
  beforeEach(() => {
    // Create a buffer manager with test settings
    bufferManager = new BufferManager({
      maxMemoryMB: 10,
      streamThresholdMB: 2,
      maxCachedBuffers: 5,
      autoCleanup: false // Disable for tests to avoid timer issues
    });
    
    // Mock fetch for streaming tests
    global.fetch = vi.fn().mockImplementation((_: string, options?: any) => {
      if (options?.method === 'HEAD') {
        return Promise.resolve({
          ok: true,
          headers: new Headers({
            'content-length': '5242880' // 5MB
          })
        });
      }
      
      return Promise.resolve({
        ok: true,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024))
      });
    }) as any;
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('should store and retrieve buffers', () => {
    // Create a mock buffer (1 channel, 22050 samples = ~0.5 seconds)
    const buffer = createMockBuffer(1, 22050);
    
    // Store the buffer
    bufferManager.storeBuffer('test-buffer', buffer, 'test-source');
    
    // Retrieve the buffer
    const retrieved = bufferManager.getBuffer('test-buffer');
    
    // Verify it's the same buffer
    expect(retrieved).toBe(buffer);
  });
  
  it('should track memory usage correctly', () => {
    // Create multiple buffers of different sizes
    const buffer1 = createMockBuffer(1, 22050); // ~86KB (1 channel, 0.5s)
    const buffer2 = createMockBuffer(2, 44100); // ~344KB (2 channels, 1s)
    const buffer3 = createMockBuffer(2, 88200); // ~688KB (2 channels, 2s)
    
    // Store the buffers
    bufferManager.storeBuffer('buffer-1', buffer1, 'test');
    bufferManager.storeBuffer('buffer-2', buffer2, 'test');
    bufferManager.storeBuffer('buffer-3', buffer3, 'test');
    
    // Get buffer usage
    const usage = bufferManager.getBufferUsage();
    
    // Total should be approximately: 
    // (1 * 22050 * 4) + (2 * 44100 * 4) + (2 * 88200 * 4) = 1118000 bytes
    expect(usage.totalMemoryBytes).toBeGreaterThan(1000000);
    expect(usage.totalMemoryBytes).toBeLessThan(1200000);
    expect(usage.cachedBuffers).toBe(3);
    expect(usage.bufferIds).toContain('buffer-1');
    expect(usage.bufferIds).toContain('buffer-2');
    expect(usage.bufferIds).toContain('buffer-3');
  });
  
  it('should retain and release buffers correctly', () => {
    // Create and store a buffer
    const buffer = createMockBuffer(2, 44100);
    bufferManager.storeBuffer('test-buffer', buffer, 'test');
    
    // Retain the buffer
    const retained = bufferManager.retainBuffer('test-buffer');
    expect(retained).toBe(true);
    
    // Check that it's marked as active
    const usage = bufferManager.getBufferUsage();
    expect(usage.activeBuffers).toBe(1);
    
    // Release the buffer
    const released = bufferManager.releaseBuffer('test-buffer');
    expect(released).toBe(true);
    
    // It should still be in cache but not active
    const usage2 = bufferManager.getBufferUsage();
    expect(usage2.cachedBuffers).toBe(1);
    expect(usage2.activeBuffers).toBe(0);
  });
  
  it('should handle manual buffer cleanup', () => {
    // Create and store several buffers
    for (let i = 0; i < 3; i++) {
      const buffer = createMockBuffer(1, 22050);
      bufferManager.storeBuffer(`buffer-${i}`, buffer, 'test');
    }
    
    // Remove one specifically
    const removed = bufferManager.removeBuffer('buffer-1');
    expect(removed).toBe(true);
    
    // Check that it's gone
    const retrievedAfterRemoval = bufferManager.getBuffer('buffer-1');
    expect(retrievedAfterRemoval).toBeNull();
    
    // Clear entire cache
    bufferManager.clearCache();
    
    // Check that all buffers are gone
    const usage = bufferManager.getBufferUsage();
    expect(usage.cachedBuffers).toBe(0);
  });
  
  it('should initialize streaming correctly', async () => {
    // Initialize streaming for a URL
    const streamInfo = bufferManager.initStreaming('stream-1', 'https://example.com/audio.mp3');
    
    // Initially should be in LOADING state (not INACTIVE as previously expected)
    expect(streamInfo.status).toBe(StreamingStatus.LOADING);
    
    // Wait for metadata loading to complete
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Get updated status
    const updatedInfo = bufferManager.getStreamingStatus('stream-1');
    expect(updatedInfo).not.toBeNull();
    
    if (updatedInfo) {
      // Should now be READY
      expect(updatedInfo.status).toBe(StreamingStatus.READY);
      // Should have total size from the HEAD request
      expect(updatedInfo.totalSize).toBe(5242880);
    }
  });
  
  it('should update streaming position', async () => {
    // Initialize streaming
    bufferManager.initStreaming('stream-2', 'https://example.com/audio.mp3');
    
    // Wait for metadata
    await new Promise(resolve => setTimeout(resolve, 10));
    
    // Update position
    bufferManager.updateStreamingPosition('stream-2', 15.5);
    
    // Get updated status
    const info = bufferManager.getStreamingStatus('stream-2');
    
    // Should have updated position
    expect(info?.currentTime).toBe(15.5);
  });
}); 