/**
 * Audio Buffer Manager
 * 
 * Manages audio buffer caching, memory optimization, and streaming for large audio files
 */

import { CacheManager, type BufferUsageInfo as CacheBufferUsageInfo, BufferCacheEntry } from './cache-manager';
import { StreamManager, StreamingStatus, type StreamingInfo } from './stream-manager';
import { BufferRecycler } from './buffer-recycler';

/**
 * Options for buffer management
 */
export interface BufferManagerOptions {
  /**
   * Maximum amount of memory to use for audio buffers (in MB)
   */
  maxMemoryMB?: number;
  
  /**
   * Size threshold for streaming large files (in MB)
   */
  streamThresholdMB?: number;
  
  /**
   * Maximum number of buffers to keep in cache
   */
  maxCachedBuffers?: number;
  
  /**
   * Whether to automatically clean up unused buffers
   */
  autoCleanup?: boolean;

  /**
   * Cleanup interval in milliseconds
   */
  cleanupIntervalMs?: number;

  /**
   * Minimum time (in ms) a buffer must be unused before cleanup
   */
  minUnusedTimeMs?: number;
}

/**
 * Information about current buffer usage
 */
export type BufferUsageInfo = CacheBufferUsageInfo;

// Re-export types and enums
export { StreamingStatus } from './stream-manager';

/**
 * Manages audio buffer caching and optimization
 */
export class BufferManager {
  private cacheManager: CacheManager;
  private streamManager: StreamManager;
  private bufferRecycler: BufferRecycler;
  
  /**
   * Create a new buffer manager
   */
  constructor(options: BufferManagerOptions = {}) {
    this.cacheManager = new CacheManager(options);
    this.streamManager = new StreamManager();
    this.bufferRecycler = new BufferRecycler();
    
    // Connect the components
    this.cacheManager.setBufferRecycler(this.bufferRecycler);
  }
  
  /**
   * Set audio context
   */
  setAudioContext(context: AudioContext): void {
    this.streamManager.setAudioContext(context);
  }
  
  /**
   * Get buffer from cache
   */
  getBuffer(id: string): AudioBuffer | null {
    return this.cacheManager.getBuffer(id);
  }
  
  /**
   * Store buffer in cache
   */
  storeBuffer(id: string, buffer: AudioBuffer, source: string): boolean {
    return this.cacheManager.storeBuffer(id, buffer, source);
  }
  
  /**
   * Increase reference count for buffer
   */
  retainBuffer(id: string): boolean {
    return this.cacheManager.retainBuffer(id);
  }
  
  /**
   * Decrease reference count for buffer
   */
  releaseBuffer(id: string): boolean {
    return this.cacheManager.releaseBuffer(id);
  }
  
  /**
   * Remove buffer from cache
   */
  removeBuffer(id: string): boolean {
    return this.cacheManager.removeBuffer(id);
  }
  
  /**
   * Clear all buffers from cache
   */
  clearCache(): void {
    this.cacheManager.clearCache();
  }
  
  /**
   * Get current buffer usage information
   */
  getBufferUsage(): BufferUsageInfo {
    return this.cacheManager.getBufferUsage();
  }
  
  /**
   * Initialize streaming for a large audio file
   */
  initStreaming(id: string, url: string, options: { bufferAheadTime?: number } = {}): StreamingInfo {
    return this.streamManager.initStreaming(id, url, options);
  }
  
  /**
   * Get streaming status
   */
  getStreamingStatus(id: string): StreamingInfo | null {
    return this.streamManager.getStreamingStatus(id);
  }
  
  /**
   * Update streaming playback position
   */
  updateStreamingPosition(id: string, currentTime: number): void {
    this.streamManager.updateStreamingPosition(id, currentTime);
  }
  
  /**
   * Manually clean up unused buffers
   */
  cleanupUnusedBuffers(): number {
    return this.cacheManager.cleanupUnusedBuffers();
  }
  
  /**
   * Find a recyclable buffer that matches the criteria
   */
  findRecyclableBuffer(channels: number, length: number, sampleRate: number): AudioBuffer | null {
    return this.bufferRecycler.findRecyclableBuffer(channels, length, sampleRate);
  }
  
  /**
   * Dispose and clean up resources
   */
  dispose(): void {
    this.cacheManager.dispose();
    this.streamManager.dispose();
    this.bufferRecycler.dispose();
  }
} 