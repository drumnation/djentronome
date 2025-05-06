/**
 * Audio Buffer Cache Manager
 * 
 * Handles caching of audio buffers and memory management
 */
import type { BufferManagerOptions } from './index';
// Import buffer-recycler using a type import to avoid missing module errors
import type { BufferRecycler } from '../buffer-manager/buffer-recycler';

/**
 * Buffer cache entry with metadata
 */
export interface BufferCacheEntry {
  /**
   * The audio buffer
   */
  buffer: AudioBuffer;
  
  /**
   * Size in bytes
   */
  size: number;
  
  /**
   * Last access timestamp
   */
  lastAccessed: number;
  
  /**
   * Reference count (how many active users)
   */
  refCount: number;
  
  /**
   * File source
   */
  source: string;

  /**
   * Whether this buffer is marked for recycling
   */
  markedForRecycling: boolean;
}

/**
 * Information about current buffer usage
 */
export interface BufferUsageInfo {
  /**
   * Total memory usage in bytes
   */
  totalMemoryBytes: number;
  
  /**
   * Total memory usage in MB
   */
  totalMemoryMB: number;
  
  /**
   * Number of cached buffers
   */
  cachedBuffers: number;
  
  /**
   * Number of active buffers
   */
  activeBuffers: number;
  
  /**
   * List of buffer IDs in cache
   */
  bufferIds: string[];

  /**
   * Memory limit in MB
   */
  memoryLimitMB: number;

  /**
   * Percentage of memory used (0-100)
   */
  memoryUsagePercentage: number;
}

/**
 * Default options for buffer cache
 */
const DEFAULT_OPTIONS: Required<BufferManagerOptions> = {
  maxMemoryMB: 100,
  streamThresholdMB: 10,
  maxCachedBuffers: 20,
  autoCleanup: true,
  cleanupIntervalMs: 30000, // 30 seconds
  minUnusedTimeMs: 60000 // 1 minute
};

/**
 * Manages audio buffer caching and memory optimization
 */
export class CacheManager {
  private bufferCache: Map<string, BufferCacheEntry> = new Map();
  private options: Required<BufferManagerOptions>;
  private cleanupTimer: any = null;
  private lastMemoryWarning: number = 0;
  private bufferRecycler: BufferRecycler | null = null;
  
  /**
   * Create a new cache manager
   */
  constructor(options: BufferManagerOptions = {}) {
    this.options = {
      ...DEFAULT_OPTIONS,
      ...options
    };

    if (this.options.autoCleanup) {
      this.startAutoCleanup();
    }
  }

  /**
   * Set the buffer recycler instance
   */
  setBufferRecycler(recycler: BufferRecycler): void {
    this.bufferRecycler = recycler;
  }
  
  /**
   * Get buffer from cache
   */
  getBuffer(id: string): AudioBuffer | null {
    const entry = this.bufferCache.get(id);
    if (!entry) {
      return null;
    }
    
    // Update last accessed time and ref count
    entry.lastAccessed = Date.now();
    
    return entry.buffer;
  }
  
  /**
   * Store buffer in cache
   */
  storeBuffer(id: string, buffer: AudioBuffer, source: string): boolean {
    // Check if we need to free up space first
    const bufferSizeBytes = this.estimateBufferSize(buffer);
    const bufferSizeMB = bufferSizeBytes / (1024 * 1024);
    
    // If buffer is larger than stream threshold, don't cache it
    if (bufferSizeMB > this.options.streamThresholdMB) {
      console.warn(`Buffer ${id} is larger than stream threshold (${bufferSizeMB.toFixed(2)}MB), consider streaming`);
    }
    
    // Make sure we have space
    this.ensureSpace(bufferSizeBytes);
    
    // Store the buffer
    this.bufferCache.set(id, {
      buffer,
      size: bufferSizeBytes,
      lastAccessed: Date.now(),
      refCount: 0,
      source,
      markedForRecycling: false
    });
    
    return true;
  }
  
  /**
   * Increase reference count for buffer
   */
  retainBuffer(id: string): boolean {
    const entry = this.bufferCache.get(id);
    if (!entry) {
      return false;
    }
    
    entry.refCount++;
    entry.lastAccessed = Date.now();
    return true;
  }
  
  /**
   * Decrease reference count for buffer
   */
  releaseBuffer(id: string): boolean {
    const entry = this.bufferCache.get(id);
    if (!entry) {
      return false;
    }
    
    if (entry.refCount > 0) {
      entry.refCount--;
    }
    
    // If refCount is 0, consider recycling
    if (entry.refCount === 0 && this.bufferRecycler && this.shouldRecycleBuffer(entry.buffer)) {
      this.bufferRecycler.addToRecyclePool(id, entry.buffer);
      entry.markedForRecycling = true;
    }
    
    return true;
  }
  
  /**
   * Remove buffer from cache
   */
  removeBuffer(id: string): boolean {
    const entry = this.bufferCache.get(id);
    if (!entry) {
      return false;
    }
    
    // If it's in the recycle pool, remove it there too
    if (entry.markedForRecycling && this.bufferRecycler) {
      const recycleKey = this.getRecycleKey(entry.buffer);
      this.bufferRecycler.removeFromRecyclePool(recycleKey);
    }
    
    this.bufferCache.delete(id);
    return true;
  }
  
  /**
   * Clear all buffers from cache
   */
  clearCache(): void {
    // Clear recycle pool
    if (this.bufferRecycler) {
      this.bufferRecycler.clearRecyclePool();
    }
    
    this.bufferCache.clear();
  }
  
  /**
   * Get current buffer usage information
   */
  getBufferUsage(): BufferUsageInfo {
    let totalBytes = 0;
    let activeBuffers = 0;
    
    for (const entry of this.bufferCache.values()) {
      totalBytes += entry.size;
      if (entry.refCount > 0) {
        activeBuffers++;
      }
    }
    
    const totalMB = totalBytes / (1024 * 1024);
    const percentage = (totalMB / this.options.maxMemoryMB) * 100;
    
    return {
      totalMemoryBytes: totalBytes,
      totalMemoryMB: totalMB,
      cachedBuffers: this.bufferCache.size,
      activeBuffers,
      bufferIds: Array.from(this.bufferCache.keys()),
      memoryLimitMB: this.options.maxMemoryMB,
      memoryUsagePercentage: percentage
    };
  }
  
  /**
   * Manually clean up unused buffers
   */
  cleanupUnusedBuffers(): number {
    const now = Date.now();
    const minUnusedTime = this.options.minUnusedTimeMs;
    let removedCount = 0;
    
    // Collect candidates for removal (buffers with refCount = 0 and not used recently)
    const removalCandidates: Array<[string, BufferCacheEntry]> = [];
    
    for (const [id, entry] of this.bufferCache.entries()) {
      if (entry.refCount === 0 && (now - entry.lastAccessed) > minUnusedTime) {
        removalCandidates.push([id, entry]);
      }
    }
    
    // Sort by least recently used
    removalCandidates.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
    
    // Check current memory usage
    const { totalMemoryMB, cachedBuffers } = this.getBufferUsage();
    const memoryPercentage = (totalMemoryMB / this.options.maxMemoryMB) * 100;
    
    // Determine how aggressively to clean
    let targetRemovalCount = 0;
    
    if (memoryPercentage > 90) {
      // Very high memory pressure - more aggressive cleanup
      targetRemovalCount = Math.ceil(removalCandidates.length * 0.5);
    } else if (memoryPercentage > 70) {
      // High memory pressure - moderate cleanup
      targetRemovalCount = Math.ceil(removalCandidates.length * 0.3);
    } else if (cachedBuffers > this.options.maxCachedBuffers) {
      // Too many buffers - light cleanup
      targetRemovalCount = cachedBuffers - this.options.maxCachedBuffers;
    } else {
      // Normal operation - minimal cleanup
      targetRemovalCount = Math.ceil(removalCandidates.length * 0.1);
    }
    
    // Remove buffers (limit to the target count)
    const candidatesToRemove = removalCandidates.slice(0, targetRemovalCount);
    for (const [id, entry] of candidatesToRemove) {
      // Offer to recycle pool if appropriate
      if (this.bufferRecycler && this.shouldRecycleBuffer(entry.buffer) && !entry.markedForRecycling) {
        this.bufferRecycler.addToRecyclePool(id, entry.buffer);
      }
      
      this.bufferCache.delete(id);
      removedCount++;
    }
    
    return removedCount;
  }
  
  /**
   * Check if a buffer should be recycled
   */
  private shouldRecycleBuffer(buffer: AudioBuffer): boolean {
    // Only recycle standard format buffers
    return buffer.numberOfChannels <= 2 && buffer.sampleRate === 44100;
  }
  
  /**
   * Get a key for the recycle pool based on buffer properties
   */
  private getRecycleKey(buffer: AudioBuffer): string {
    return this.getRecycleKeyFromParams(
      buffer.numberOfChannels,
      buffer.length,
      buffer.sampleRate
    );
  }
  
  /**
   * Get a key for the recycle pool based on explicit parameters
   */
  private getRecycleKeyFromParams(channels: number, length: number, sampleRate: number): string {
    return `${channels}-${length}-${sampleRate}`;
  }
  
  /**
   * Estimate the memory size of an audio buffer
   */
  private estimateBufferSize(buffer: AudioBuffer): number {
    // Each sample is a 32-bit float (4 bytes)
    return buffer.numberOfChannels * buffer.length * 4;
  }
  
  /**
   * Make sure there's enough space for a new buffer
   */
  private ensureSpace(newBufferSize: number): void {
    const { totalMemoryBytes, totalMemoryMB } = this.getBufferUsage();
    const newBufferMB = newBufferSize / (1024 * 1024);
    
    // Check if adding this buffer would exceed our memory limit
    if ((totalMemoryMB + newBufferMB) > this.options.maxMemoryMB) {
      // We need to free up some space
      const bytesToFree = (totalMemoryBytes + newBufferSize) - (this.options.maxMemoryMB * 1024 * 1024);
      
      // Find buffers we can remove (prioritize by least recently used and not active)
      const candidates: Array<[string, BufferCacheEntry]> = [];
      
      for (const [id, entry] of this.bufferCache.entries()) {
        if (entry.refCount === 0) {
          candidates.push([id, entry]);
        }
      }
      
      // Sort by least recently used
      candidates.sort((a, b) => a[1].lastAccessed - b[1].lastAccessed);
      
      // Remove buffers until we free enough space
      let freedBytes = 0;
      
      for (const [id, entry] of candidates) {
        // Add to recycle pool if appropriate
        if (this.bufferRecycler && this.shouldRecycleBuffer(entry.buffer) && !entry.markedForRecycling) {
          this.bufferRecycler.addToRecyclePool(id, entry.buffer);
        }
        
        // Remove from cache
        this.bufferCache.delete(id);
        freedBytes += entry.size;
        
        if (freedBytes >= bytesToFree) {
          break;
        }
      }
      
      // If we still don't have enough space, warn about memory pressure
      if (freedBytes < bytesToFree) {
        const now = Date.now();
        // Only warn once every 5 seconds to avoid spamming
        if (now - this.lastMemoryWarning > 5000) {
          console.warn(
            `Memory pressure in buffer cache: ${totalMemoryMB.toFixed(2)}MB used, ` +
            `limit is ${this.options.maxMemoryMB}MB, trying to add ${newBufferMB.toFixed(2)}MB buffer. ` +
            `Some active buffers might need to be released.`
          );
          this.lastMemoryWarning = now;
        }
      }
    }
    
    // Also check number of buffers
    if (this.bufferCache.size >= this.options.maxCachedBuffers) {
      // Too many buffers, remove some inactive ones
      this.cleanupUnusedBuffers();
    }
  }
  
  /**
   * Start automatic cleanup timer
   */
  private startAutoCleanup(): void {
    if (this.cleanupTimer !== null) {
      this.stopAutoCleanup();
    }
    
    // Use cross-environment compatible timer
    // This works in both browser and Node.js environments
    const timerFunction = typeof window !== 'undefined' ? window.setInterval : setInterval;
    
    this.cleanupTimer = timerFunction(() => {
      this.cleanupUnusedBuffers();
    }, this.options.cleanupIntervalMs);
  }
  
  /**
   * Stop automatic cleanup timer
   */
  private stopAutoCleanup(): void {
    if (this.cleanupTimer !== null) {
      // Use cross-environment compatible clear function
      const clearFunction = typeof window !== 'undefined' ? window.clearInterval : clearInterval;
      clearFunction(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }
  
  /**
   * Dispose and clean up resources
   */
  dispose(): void {
    this.stopAutoCleanup();
    this.clearCache();
  }
} 