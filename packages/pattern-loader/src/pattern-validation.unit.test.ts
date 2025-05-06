import { describe, it, expect } from 'vitest';
import { PatternLoader } from './pattern-loader';
import { 
  DifficultyLevel, 
  Pattern, 
  ValidationError, 
  ValidationErrorType 
} from './types';

// Sample valid pattern for testing
const validPattern: Pattern = {
  id: 'test-pattern-1',
  version: '1.0',
  metadata: {
    title: 'Test Pattern',
    difficulty: DifficultyLevel.MEDIUM,
    bpm: 120,
    timeSignature: '4/4',
    tags: ['test', 'basic']
  },
  duration: 10000,
  notes: [
    { time: 0, type: 'kick', midiNote: 36 },
    { time: 500, type: 'snare', midiNote: 38 },
    { time: 1000, type: 'kick', midiNote: 36 },
    { time: 1500, type: 'snare', midiNote: 38 }
  ]
};

// Sample pattern with sections
const patternWithSections: Pattern = {
  id: 'test-pattern-sections',
  version: '1.0',
  metadata: {
    title: 'Test Pattern with Sections',
    difficulty: DifficultyLevel.MEDIUM,
    bpm: 120,
    timeSignature: '4/4'
  },
  duration: 10000,
  sections: [
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
      name: 'Main Section',
      startTime: 4000,
      endTime: 10000,
      notes: [
        { time: 4000, type: 'kick' },
        { time: 5000, type: 'snare' },
        { time: 6000, type: 'kick' },
        { time: 7000, type: 'snare' }
      ]
    }
  ]
};

describe('PatternValidator', () => {
  it('should validate a valid pattern without sections', () => {
    const loader = new PatternLoader();
    const result = loader.validatePattern(validPattern);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.detailedErrors).toBeUndefined();
  });
  
  it('should validate a valid pattern with sections', () => {
    const loader = new PatternLoader();
    const result = loader.validatePattern(patternWithSections);
    
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.detailedErrors).toBeUndefined();
  });
  
  it('should detect missing ID field', () => {
    const loader = new PatternLoader();
    const invalidPattern = { ...validPattern, id: undefined } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field "id"');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0]).toBeInstanceOf(ValidationError);
    expect(errors[0].type).toBe(ValidationErrorType.MISSING_FIELD);
    expect(errors[0].field).toBe('id');
  });
  
  it('should detect missing metadata fields', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...validPattern,
      metadata: {
        ...validPattern.metadata,
        title: undefined,
        bpm: undefined
      }
    } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Missing required field "title" in metadata');
    expect(result.errors).toContain('Missing required field "bpm" in metadata');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors.length).toBe(2);
    
    // Check first error
    expect(errors[0].type).toBe(ValidationErrorType.MISSING_FIELD);
    expect(errors[0].field).toBe('metadata.title');
    
    // Check second error
    expect(errors[1].type).toBe(ValidationErrorType.MISSING_FIELD);
    expect(errors[1].field).toBe('metadata.bpm');
  });
  
  it('should detect invalid difficulty value', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...validPattern,
      metadata: {
        ...validPattern.metadata,
        difficulty: 'invalid' // Not a valid DifficultyLevel
      }
    } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid value for "difficulty" in metadata');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_VALUE);
    expect(errors[0].field).toBe('metadata.difficulty');
  });
  
  it('should detect structural error when neither notes nor sections are provided', () => {
    const loader = new PatternLoader();
    const invalidPattern = { ...validPattern, notes: undefined } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Pattern must have either notes or sections');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0].type).toBe(ValidationErrorType.STRUCTURAL_ERROR);
  });
  
  it('should detect missing note fields', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...validPattern,
      notes: [
        { type: 'kick' }, // Missing time
        { time: 1000 }    // Missing type
      ]
    } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Note 0 is missing required field "time"');
    expect(result.errors).toContain('Note 1 is missing required field "type"');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors.length).toBe(2);
  });
  
  it('should detect missing section fields', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...patternWithSections,
      sections: [
        { name: 'Invalid Section', notes: [] }  // Missing id, startTime, endTime
      ]
    } as unknown as Pattern;
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Section 0 is missing required field "id"');
    expect(result.errors).toContain('Section 0 is missing required field "startTime"');
    expect(result.errors).toContain('Section 0 is missing required field "endTime"');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors.length).toBe(3);
  });
  
  it('should detect overlapping sections', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...patternWithSections,
      sections: [
        {
          id: 'section1',
          name: 'Section 1',
          startTime: 0,
          endTime: 5000,
          notes: []
        },
        {
          id: 'section2',
          name: 'Section 2',
          startTime: 4000, // Overlaps with section1
          endTime: 10000,
          notes: []
        }
      ]
    };
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Sections overlap: "section1" and "section2"');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0].type).toBe(ValidationErrorType.STRUCTURAL_ERROR);
    expect(errors[0].field).toBe('sections');
  });
  
  it('should detect invalid note times outside section boundaries', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...patternWithSections,
      sections: [
        {
          id: 'test',
          name: 'Test Section',
          startTime: 0,
          endTime: 5000,
          notes: [
            { time: -100, type: 'kick' },     // Before section starts
            { time: 5500, type: 'snare' }      // After section ends
          ]
        }
      ]
    };
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Note 0 in section "test" has time outside section boundaries');
    expect(result.errors).toContain('Note 1 in section "test" has time outside section boundaries');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors.length).toBe(2);
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_VALUE);
  });
  
  it('should detect invalid BPM value', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...validPattern,
      metadata: {
        ...validPattern.metadata,
        bpm: -10 // Negative BPM is invalid
      }
    };
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid value for "bpm" in metadata: must be positive');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0].type).toBe(ValidationErrorType.INVALID_VALUE);
    expect(errors[0].field).toBe('metadata.bpm');
  });
  
  it('should detect invalid time signature format', () => {
    const loader = new PatternLoader();
    const invalidPattern = {
      ...validPattern,
      metadata: {
        ...validPattern.metadata,
        timeSignature: '4-4' // Invalid format, should be "4/4"
      }
    };
    
    const result = loader.validatePattern(invalidPattern);
    
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Invalid time signature format: must be in format "n/d"');
    expect(result.detailedErrors).toBeDefined();
    const errors = result.detailedErrors!;
    expect(errors[0].type).toBe(ValidationErrorType.FORMAT_ERROR);
    expect(errors[0].field).toBe('metadata.timeSignature');
  });
}); 