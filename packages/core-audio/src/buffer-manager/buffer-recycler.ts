/**
 * Audio Buffer Recycler
 * 
 * Manages recycling and pooling of audio buffers to reduce garbage collection
 */

/**
 * Manages recycling and pooling of AudioBuffers
 */
export class BufferRecycler {
  private recyclePool: Map<string, AudioBuffer> = new Map();
  
  /**
   * Create a new buffer recycler
   */
  constructor() {
    // Nothing to initialize
  }
  
  /**
   * Add a buffer to the recycle pool
   */
  addToRecyclePool(_: string, buffer: AudioBuffer): void {
    const key = this.getRecycleKey(buffer);
    this.recyclePool.set(key, buffer);
  }
  
  /**
   * Remove a buffer from the recycle pool
   */
  removeFromRecyclePool(key: string): boolean {
    return this.recyclePool.delete(key);
  }
  
  /**
   * Clear the recycle pool
   */
  clearRecyclePool(): void {
    this.recyclePool.clear();
  }
  
  /**
   * Find a recyclable buffer that matches the criteria
   */
  findRecyclableBuffer(channels: number, length: number, sampleRate: number): AudioBuffer | null {
    const key = this.getRecycleKeyFromParams(channels, length, sampleRate);
    return this.recyclePool.get(key) || null;
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
   * Dispose and clean up resources
   */
  dispose(): void {
    this.clearRecyclePool();
  }
} 