import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PatternLoader } from './pattern-loader';
import { DifficultyLevel, Pattern } from './types';

// Mock sample pattern data
const samplePattern: Pattern = {
  id: 'test-pattern-1',
  version: '1.0',
  metadata: {
    title: 'Test Pattern',
    artist: 'Test Artist',
    creator: 'Test Creator',
    difficulty: DifficultyLevel.MEDIUM,
    bpm: 120,
    timeSignature: '4/4',
    tags: ['test', 'basic']
  },
  duration: 10000, // 10 seconds
  notes: [
    { time: 0, type: 'kick', midiNote: 36 },
    { time: 500, type: 'snare', midiNote: 38 },
    { time: 1000, type: 'kick', midiNote: 36 },
    { time: 1500, type: 'snare', midiNote: 38 }
  ]
};

// Mock fetch
global.fetch = vi.fn();

describe('PatternLoader', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should initialize with default options', () => {
    const loader = new PatternLoader();
    expect(loader).toBeDefined();
  });
  
  it('should initialize with custom options', () => {
    const loader = new PatternLoader({
      basePath: '/patterns',
      validate: true,
      defaultVersion: '1.0'
    });
    expect(loader).toBeDefined();
  });
  
  it('should load a pattern from a file path', async () => {
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pattern: samplePattern })
    });
    
    const loader = new PatternLoader();
    const pattern = await loader.loadPattern('/patterns/test-pattern.json');
    
    expect(fetch).toHaveBeenCalledWith('/patterns/test-pattern.json');
    expect(pattern).toEqual(samplePattern);
  });
  
  it('should load a pattern with a base path', async () => {
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pattern: samplePattern })
    });
    
    const loader = new PatternLoader({ basePath: '/base/path' });
    const pattern = await loader.loadPattern('test-pattern.json');
    
    expect(fetch).toHaveBeenCalledWith('/base/path/test-pattern.json');
    expect(pattern).toEqual(samplePattern);
  });
  
  it('should handle fetch errors', async () => {
    // Mock fetch response
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const loader = new PatternLoader();
    
    await expect(loader.loadPattern('/patterns/test-pattern.json'))
      .rejects.toThrow('Failed to load pattern: Network error');
  });
  
  it('should handle invalid JSON responses', async () => {
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => { throw new Error('Invalid JSON'); }
    });
    
    const loader = new PatternLoader();
    
    await expect(loader.loadPattern('/patterns/test-pattern.json'))
      .rejects.toThrow('Failed to parse pattern file: Invalid JSON');
  });
  
  it('should validate patterns when validate option is true', async () => {
    // Create an invalid pattern with a type assertion to bypass type checking for testing
    const invalidPattern = JSON.parse(JSON.stringify(samplePattern)) as Pattern;
    // @ts-ignore - Intentionally creating an invalid pattern for testing
    invalidPattern.metadata.title = undefined;
    
    // Mock fetch response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ pattern: invalidPattern })
    });
    
    const loader = new PatternLoader({ validate: true });
    
    await expect(loader.loadPattern('/patterns/test-pattern.json'))
      .rejects.toThrow('Invalid pattern: Missing required field "title" in metadata');
  });
  
  it('should create a pattern from raw data', () => {
    const loader = new PatternLoader();
    const pattern = loader.createPattern(samplePattern);
    
    expect(pattern).toEqual(samplePattern);
  });
  
  it('should validate a valid pattern', () => {
    const loader = new PatternLoader();
    // Ensure the title field is explicitly set
    const validPattern = {
      ...samplePattern,
      metadata: {
        ...samplePattern.metadata,
        title: 'Test Pattern' // Explicitly add title to ensure it's present
      }
    };
    const result = loader.validatePattern(validPattern);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });
  
  it('should detect invalid patterns', () => {
    const loader = new PatternLoader();
    
    // Create an invalid pattern with a type assertion to bypass type checking for testing
    const invalidPattern = JSON.parse(JSON.stringify(samplePattern)) as Pattern;
    // @ts-ignore - Intentionally creating an invalid pattern for testing
    invalidPattern.metadata.title = undefined;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field "title" in metadata');
  });
}); 