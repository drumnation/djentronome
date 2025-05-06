import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatternLoader } from './pattern-loader';
import { DifficultyLevel, Pattern } from './types';

// Sample test pattern
const samplePattern: Pattern = {
  id: 'cache-test-pattern',
  version: '1.0',
  metadata: {
    title: 'Test Pattern',
    difficulty: DifficultyLevel.MEDIUM,
    bpm: 120,
    timeSignature: '4/4'
  },
  duration: 10000,
  notes: [
    { time: 0, type: 'kick' },
    { time: 1000, type: 'snare' }
  ]
};

// Mock fetch
global.fetch = vi.fn();

describe('PatternLoader Cache', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Mock successful fetch response
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ pattern: samplePattern })
    });
  });
  
  it('should not cache patterns by default', async () => {
    const loader = new PatternLoader();
    
    // Load the same pattern twice
    await loader.loadPattern('test-pattern.json');
    await loader.loadPattern('test-pattern.json');
    
    // Fetch should be called twice (no caching)
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  
  it('should cache patterns when enableCache option is true', async () => {
    const loader = new PatternLoader({ enableCache: true });
    
    // Load the same pattern twice
    await loader.loadPattern('test-pattern.json');
    await loader.loadPattern('test-pattern.json');
    
    // Fetch should be called only once (caching works)
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  
  it('should return correct cache size', async () => {
    const loader = new PatternLoader({ enableCache: true });
    
    // Initially, cache should be empty
    expect(loader.getCacheSize()).toBe(0);
    
    // After loading a pattern, cache should have one entry
    await loader.loadPattern('test-pattern.json');
    expect(loader.getCacheSize()).toBe(1);
    
    // Loading a different pattern should add another entry
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        pattern: { ...samplePattern, id: 'different-pattern' } 
      })
    });
    
    await loader.loadPattern('different-pattern.json');
    expect(loader.getCacheSize()).toBe(2);
  });
  
  it('should clear the cache when clearCache is called', async () => {
    const loader = new PatternLoader({ enableCache: true });
    
    // Load a pattern to fill the cache
    await loader.loadPattern('test-pattern.json');
    expect(loader.getCacheSize()).toBe(1);
    
    // Clear the cache
    loader.clearCache();
    expect(loader.getCacheSize()).toBe(0);
    
    // Loading the pattern again should make a new fetch request
    await loader.loadPattern('test-pattern.json');
    expect(fetch).toHaveBeenCalledTimes(2);
  });
  
  it('should remove a specific pattern from the cache', async () => {
    const loader = new PatternLoader({ enableCache: true });
    
    // Load two patterns
    await loader.loadPattern('pattern1.json');
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        pattern: { ...samplePattern, id: 'pattern2' } 
      })
    });
    
    await loader.loadPattern('pattern2.json');
    expect(loader.getCacheSize()).toBe(2);
    
    // Remove one pattern from cache
    const result = loader.removeFromCache('pattern1.json');
    expect(result).toBe(true);
    expect(loader.getCacheSize()).toBe(1);
    
    // Trying to remove a non-existent pattern should return false
    const nonExistentResult = loader.removeFromCache('non-existent.json');
    expect(nonExistentResult).toBe(false);
  });
  
  it('should respect the cache size limit', async () => {
    const cacheSize = 2;
    const loader = new PatternLoader({ 
      enableCache: true,
      cacheSize 
    });
    
    // Load three patterns (one more than the cache size)
    await loader.loadPattern('pattern1.json');
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        pattern: { ...samplePattern, id: 'pattern2' } 
      })
    });
    
    await loader.loadPattern('pattern2.json');
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        pattern: { ...samplePattern, id: 'pattern3' } 
      })
    });
    
    await loader.loadPattern('pattern3.json');
    
    // Cache size should still be limited to the specified size
    expect(loader.getCacheSize()).toBe(cacheSize);
    
    // The first pattern should have been removed from the cache
    // So loading it again should make a new fetch request
    vi.resetAllMocks();
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pattern: samplePattern })
    });
    
    await loader.loadPattern('pattern1.json');
    expect(fetch).toHaveBeenCalledTimes(1);
  });
}); 