import { Pattern } from './types';

/**
 * Class for caching loaded patterns to improve performance
 * 
 * This class is part of a modular design where:
 * - PatternLoader handles loading patterns from sources
 * - PatternCache handles caching for performance
 * - PatternValidator handles validation logic
 * 
 * Benefits of this separation:
 * - Each class has a single responsibility
 * - Easier testing of caching behavior in isolation
 * - Cache implementation can be changed without affecting loader
 */
export class PatternCache {
  private cache: Map<string, Pattern> = new Map();
  private cacheSize: number;

  /**
   * Create a new PatternCache
   * 
   * @param cacheSize - Maximum number of patterns to keep in cache
   */
  constructor(cacheSize = 10) {
    this.cacheSize = cacheSize;
  }

  /**
   * Get a pattern from the cache
   * 
   * @param path - The pattern file path
   * @returns The cached pattern or undefined if not in cache
   */
  get(path: string): Pattern | undefined {
    return this.cache.get(path);
  }

  /**
   * Add a pattern to the cache, respecting cache size limit
   * 
   * @param path - The pattern file path
   * @param pattern - The pattern to cache
   */
  add(path: string, pattern: Pattern): void {
    // If cache is at size limit, remove oldest entry (first item in map)
    if (this.cacheSize && this.cache.size >= this.cacheSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    // Add new pattern to cache
    this.cache.set(path, pattern);
  }

  /**
   * Remove a specific pattern from the cache
   * 
   * @param path - The pattern file path
   * @returns true if the pattern was in the cache and was removed
   */
  remove(path: string): boolean {
    return this.cache.delete(path);
  }

  /**
   * Clear the pattern cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get number of patterns in cache
   * 
   * @returns The current number of cached patterns
   */
  size(): number {
    return this.cache.size;
  }
} 