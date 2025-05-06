import { describe, it, expect } from 'vitest';
import { PatternValidator } from '../pattern-validator';
import { DifficultyLevel, Pattern } from '../types';

describe('PatternValidator', () => {
  const validator = new PatternValidator();
  
  // Helper function to create a valid base pattern for testing
  const createValidPattern = (withNotes = true): Pattern => ({
    id: 'test-pattern',
    version: '1.0',
    duration: 8000,
    metadata: {
      title: 'Test Pattern',
      difficulty: DifficultyLevel.MEDIUM,
      bpm: 120,
      timeSignature: '4/4'
    },
    ...(withNotes ? {
      notes: [
        { time: 0, type: 'kick' },
        { time: 1000, type: 'snare' }
      ]
    } : {})
  });

  it('should validate a valid pattern', () => {
    const pattern = createValidPattern();
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.detailedErrors).toBeUndefined();
  });

  it('should validate a valid pattern with sections', () => {
    // Create pattern without notes
    const pattern = createValidPattern(false);
    // Add sections
    pattern.sections = [
      {
        id: 'intro',
        name: 'Intro',
        startTime: 0,
        endTime: 4000,
        notes: [
          { time: 0, type: 'kick' },
          { time: 1000, type: 'snare' }
        ]
      },
      {
        id: 'main',
        name: 'Main',
        startTime: 4000,
        endTime: 8000,
        notes: [
          { time: 4000, type: 'kick' },
          { time: 5000, type: 'snare' }
        ]
      }
    ];
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.detailedErrors).toBeUndefined();
  });

  it('should detect missing required fields', () => {
    // Create pattern without id and title
    const pattern = {
      version: '1.0',
      duration: 8000,
      metadata: {
        difficulty: DifficultyLevel.MEDIUM,
        bpm: 120,
        timeSignature: '4/4'
      },
      notes: [
        { time: 0, type: 'kick' },
        { time: 1000, type: 'snare' }
      ]
    } as Pattern;
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.detailedErrors?.some(e => e.field === 'id')).toBe(true);
    expect(result.detailedErrors?.some(e => e.field === 'metadata.title')).toBe(true);
  });

  it('should detect invalid time signature format', () => {
    const pattern = createValidPattern();
    // Set invalid time signature
    pattern.metadata.timeSignature = 'invalid';
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.detailedErrors?.some(e => e.field === 'metadata.timeSignature')).toBe(true);
  });

  it('should detect invalid BPM value', () => {
    const pattern = createValidPattern();
    // Set invalid BPM
    pattern.metadata.bpm = -10;
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.detailedErrors?.some(e => e.field === 'metadata.bpm')).toBe(true);
  });

  it('should detect missing notes or sections', () => {
    // Create pattern without notes or sections
    const pattern = {
      id: 'test-pattern',
      version: '1.0',
      duration: 8000,
      metadata: {
        title: 'Test Pattern',
        difficulty: DifficultyLevel.MEDIUM,
        bpm: 120,
        timeSignature: '4/4'
      }
    } as Pattern;
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.errors.some(e => e.includes('Pattern must have either notes or sections'))).toBe(true);
  });

  it('should detect overlapping sections', () => {
    // Create pattern without notes but with overlapping sections
    const pattern = createValidPattern(false);
    pattern.sections = [
      {
        id: 'section1',
        name: 'Section 1',
        startTime: 0,
        endTime: 5000,
        notes: [{ time: 0, type: 'kick' }]
      },
      {
        id: 'section2',
        name: 'Section 2',
        startTime: 4000, // Overlaps with section1
        endTime: 8000,
        notes: [{ time: 4000, type: 'kick' }]
      }
    ];
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.errors.some(e => e.includes('Sections overlap'))).toBe(true);
  });

  it('should detect notes outside section boundaries', () => {
    // Create pattern without notes
    const pattern = createValidPattern(false);
    // Add section with note outside boundaries
    pattern.sections = [
      {
        id: 'section1',
        name: 'Section 1',
        startTime: 0,
        endTime: 4000,
        notes: [
          { time: 0, type: 'kick' },
          { time: 5000, type: 'snare' } // Outside the section boundaries
        ]
      }
    ];
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.errors.some(e => e.includes('outside section boundaries'))).toBe(true);
  });

  it('should detect invalid section time boundaries', () => {
    // Create pattern without notes
    const pattern = createValidPattern(false);
    // Add section with invalid time boundaries
    pattern.sections = [
      {
        id: 'section1',
        name: 'Section 1',
        startTime: 5000,
        endTime: 3000, // endTime < startTime
        notes: [{ time: 2000, type: 'kick' }]
      }
    ];
    
    const result = validator.validatePattern(pattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
    expect(result.detailedErrors).toBeDefined();
    expect(result.errors.some(e => e.includes('startTime >= endTime'))).toBe(true);
  });
}); 