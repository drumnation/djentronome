import { describe, it, expect } from 'vitest';
import { PatternCache } from '../pattern-cache';
import { Pattern } from '../types';

describe('PatternCache', () => {
  // Helper function to create a test pattern
  const createTestPattern = (id: string): Pattern => ({
    id,
    version: '1.0',
    duration: 1000,
    metadata: {
      title: `Test Pattern ${id}`,
      difficulty: 'medium' as any,
      bpm: 120,
      timeSignature: '4/4'
    },
    notes: [
      { time: 0, type: 'kick' }
    ]
  });

  it('should add and retrieve a pattern from cache', () => {
    const cache = new PatternCache(10);
    const pattern = createTestPattern('test-1');
    const path = 'test-pattern-1.json';
    
    cache.add(path, pattern);
    const retrievedPattern = cache.get(path);
    
    expect(retrievedPattern).toEqual(pattern);
  });
  
  it('should return undefined for non-existent pattern', () => {
    const cache = new PatternCache(10);
    const retrievedPattern = cache.get('non-existent.json');
    
    expect(retrievedPattern).toBeUndefined();
  });
  
  it('should respect the cache size limit', () => {
    const cacheSize = 3;
    const cache = new PatternCache(cacheSize);
    
    // Add more patterns than the cache size
    for (let i = 0; i < cacheSize + 2; i++) {
      const pattern = createTestPattern(`test-${i}`);
      const path = `test-pattern-${i}.json`;
      cache.add(path, pattern);
    }
    
    // Check cache size is limited
    expect(cache.size()).toBe(cacheSize);
    
    // First items should be evicted
    expect(cache.get('test-pattern-0.json')).toBeUndefined();
    expect(cache.get('test-pattern-1.json')).toBeUndefined();
    
    // Last items should still be in cache
    expect(cache.get('test-pattern-2.json')).toBeDefined();
    expect(cache.get('test-pattern-3.json')).toBeDefined();
    expect(cache.get('test-pattern-4.json')).toBeDefined();
  });
  
  it('should remove a pattern from cache', () => {
    const cache = new PatternCache(10);
    const pattern = createTestPattern('test-1');
    const path = 'test-pattern-1.json';
    
    cache.add(path, pattern);
    expect(cache.get(path)).toBeDefined();
    
    const removed = cache.remove(path);
    expect(removed).toBe(true);
    expect(cache.get(path)).toBeUndefined();
  });
  
  it('should return false when removing non-existent pattern', () => {
    const cache = new PatternCache(10);
    const removed = cache.remove('non-existent.json');
    
    expect(removed).toBe(false);
  });
  
  it('should clear the cache', () => {
    const cache = new PatternCache(10);
    
    // Add multiple patterns
    for (let i = 0; i < 5; i++) {
      const pattern = createTestPattern(`test-${i}`);
      const path = `test-pattern-${i}.json`;
      cache.add(path, pattern);
    }
    
    expect(cache.size()).toBe(5);
    
    cache.clear();
    expect(cache.size()).toBe(0);
    
    // All patterns should be gone
    for (let i = 0; i < 5; i++) {
      const path = `test-pattern-${i}.json`;
      expect(cache.get(path)).toBeUndefined();
    }
  });
}); 