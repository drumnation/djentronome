import { describe, it, expect, vi } from 'vitest';
import { PatternLoader } from '../pattern-loader';
import { DifficultyLevel, PatternSection } from '../types';
import fs from 'fs';
import path from 'path';

// Define test file paths
const TEST_PATTERNS_DIR = path.resolve(process.cwd(), '../../test-assets/patterns');
const BASIC_PATTERN_PATH = path.join(TEST_PATTERNS_DIR, 'basic-rock-beat.json');
const COMPLEX_PATTERN_PATH = path.join(TEST_PATTERNS_DIR, 'complex-pattern.json');

// Helper function to mock the fetch API to load from local files
const mockFetchFromFileSystem = () => {
  const originalFetch = global.fetch;
  
  // Mock fetch to use the file system
  global.fetch = vi.fn().mockImplementation(async (url: string | URL | Request) => {
    const filePath = typeof url === 'string' ? url : url.toString();
    
    try {
      const data = await fs.promises.readFile(filePath, 'utf8');
      return {
        ok: true,
        json: async () => JSON.parse(data),
        status: 200,
        statusText: 'OK',
        headers: new Headers()
      } as unknown as Response;
    } catch (error) {
      console.error('Error reading file', filePath, error);
      return {
        ok: false,
        status: 404,
        statusText: 'File not found',
        headers: new Headers()
      } as unknown as Response;
    }
  });
  
  return originalFetch;
};

// Function to read pattern files directly for comparison
const readPatternFile = async (filePath: string) => {
  const data = await fs.promises.readFile(filePath, 'utf8');
  return JSON.parse(data);
};

describe('PatternLoader - File Loading (Integration)', () => {
  // Create a test to check if test files exist
  it('test pattern files should exist', async () => {
    expect(fs.existsSync(TEST_PATTERNS_DIR)).toBe(true);
    expect(fs.existsSync(BASIC_PATTERN_PATH)).toBe(true);
    expect(fs.existsSync(COMPLEX_PATTERN_PATH)).toBe(true);
    
    // Log the actual paths for debugging
    console.log('TEST_PATTERNS_DIR:', TEST_PATTERNS_DIR);
    console.log('BASIC_PATTERN_PATH:', BASIC_PATTERN_PATH);
    console.log('COMPLEX_PATTERN_PATH:', COMPLEX_PATTERN_PATH);
  });
  
  it('should load a pattern from a local file path', async () => {
    const originalFetch = mockFetchFromFileSystem();
    
    try {
      // Create a pattern loader
      const loader = new PatternLoader();
      
      // Load the basic pattern
      const pattern = await loader.loadPattern(BASIC_PATTERN_PATH);
      
      // Read the pattern file directly for comparison
      const expectedPatternFile = await readPatternFile(BASIC_PATTERN_PATH);
      
      // Verify the pattern matches the expected pattern
      expect(pattern).toEqual(expectedPatternFile.pattern);
      expect(pattern.id).toBe('basic-rock-beat');
      expect(pattern.metadata.title).toBe('Basic Rock Beat');
      expect(pattern.metadata.difficulty).toBe(DifficultyLevel.BEGINNER);
      
      // Check sections exist before testing properties
      expect(pattern.sections).toBeDefined();
      expect(pattern.sections).not.toBeNull();
      expect(pattern.sections!.length).toBe(1);
      
      // Ensure first section exists before testing its notes
      const sections = pattern.sections!;
      expect(sections[0]).toBeDefined();
      
      // Now we can safely use non-null assertions
      const firstSection = sections[0]!;
      expect(firstSection.notes).toHaveLength(16);
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
  
  it('should load a complex pattern with multiple sections', async () => {
    const originalFetch = mockFetchFromFileSystem();
    
    try {
      // Create a pattern loader
      const loader = new PatternLoader();
      
      // Load the complex pattern
      const pattern = await loader.loadPattern(COMPLEX_PATTERN_PATH);
      
      // Verify the pattern properties
      expect(pattern.id).toBe('complex-drum-pattern');
      expect(pattern.metadata.title).toBe('Complex Drum Pattern with Multiple Sections');
      expect(pattern.metadata.difficulty).toBe(DifficultyLevel.HARD);
      
      // Use non-null assertions since we know these exist in the test data
      const sections = pattern.sections!;
      expect(sections).toHaveLength(3);
      
      // Verify each section
      const sectionIds = sections.map(section => section.id);
      expect(sectionIds).toEqual(['intro', 'verse', 'outro']);
      
      // Verify time boundaries with type assertion after verifying length
      const verifiedSections = sections as [PatternSection, PatternSection, PatternSection];
      expect(verifiedSections[0].startTime).toBe(0);
      expect(verifiedSections[0].endTime).toBe(8000);
      expect(verifiedSections[1].startTime).toBe(8000);
      expect(verifiedSections[1].endTime).toBe(16000);
      expect(verifiedSections[2].startTime).toBe(16000);
      expect(verifiedSections[2].endTime).toBe(24000);
      
      // Verify total duration
      expect(pattern.duration).toBe(24000);
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
  
  it('should handle file not found errors gracefully', async () => {
    // Setup - Override fetch to simulate file not found
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: false,
        status: 404,
        statusText: 'File not found',
        headers: new Headers()
      } as unknown as Response);
    });
    
    try {
      // Create a pattern loader
      const loader = new PatternLoader();
      
      // Attempt to load a non-existent pattern
      await expect(loader.loadPattern('non-existent-pattern.json')).rejects.toThrow('HTTP error 404: File not found');
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
  
  it('should handle malformed JSON files', async () => {
    // Setup - Override fetch to return invalid JSON
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: async () => { throw new SyntaxError('Unexpected token in JSON'); },
        status: 200,
        statusText: 'OK',
        headers: new Headers()
      } as unknown as Response);
    });
    
    try {
      // Create a pattern loader
      const loader = new PatternLoader();
      
      // Attempt to load a malformed pattern
      await expect(loader.loadPattern('malformed-pattern.json')).rejects.toThrow('Failed to parse pattern file: Unexpected token in JSON');
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
  
  it('should validate patterns if validate option is true', async () => {
    // Setup - Override fetch to return an invalid pattern
    const originalFetch = global.fetch;
    global.fetch = vi.fn().mockImplementation(() => {
      return Promise.resolve({
        ok: true,
        json: async () => ({
          pattern: {
            // Missing required fields
            id: 'invalid-pattern',
            // No metadata, no notes or sections
          }
        }),
        status: 200,
        statusText: 'OK',
        headers: new Headers()
      } as unknown as Response);
    });
    
    try {
      // Create a pattern loader with validation enabled
      const loader = new PatternLoader({ validate: true });
      
      // Attempt to load an invalid pattern
      await expect(loader.loadPattern('invalid-pattern.json')).rejects.toThrow('Invalid pattern:');
    } finally {
      // Restore original fetch
      global.fetch = originalFetch;
    }
  });
}); 