/**
 * Pattern loader types
 */

/**
 * Difficulty level for patterns
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
  EXPERT = 'expert'
}

/**
 * Validation error types for more specific error handling
 */
export enum ValidationErrorType {
  MISSING_FIELD = 'missing_field',
  INVALID_VALUE = 'invalid_value',
  STRUCTURAL_ERROR = 'structural_error',
  FORMAT_ERROR = 'format_error'
}

/**
 * Pattern loader specific validation error
 */
export class ValidationError extends Error {
  public type: ValidationErrorType;
  public field?: string;
  public details?: string;

  constructor(
    message: string, 
    type: ValidationErrorType, 
    field?: string, 
    details?: string
  ) {
    super(message);
    this.name = 'ValidationError';
    this.type = type;
    this.field = field;
    this.details = details;
  }
}

/**
 * Result of pattern validation
 */
export interface ValidationResult {
  /**
   * Whether the pattern is valid
   */
  valid: boolean;
  
  /**
   * Error messages if invalid
   */
  errors: string[];
  
  /**
   * Detailed validation errors
   */
  detailedErrors?: ValidationError[];
}

/**
 * Represents a single note in a pattern
 */
export interface Note {
  /**
   * Time in milliseconds when the note should be hit
   */
  time: number;
  
  /**
   * Type of note (e.g., kick, snare, hi-hat)
   */
  type: string;
  
  /**
   * MIDI note number for this note (if applicable)
   */
  midiNote?: number;
  
  /**
   * Velocity/intensity of the note (0-1)
   */
  velocity?: number;
  
  /**
   * Duration of the note in milliseconds (for held notes)
   */
  duration?: number;
  
  /**
   * Additional metadata for the note
   */
  metadata?: Record<string, any>;
}

/**
 * Represents a section of a pattern (e.g., intro, verse, chorus)
 */
export interface PatternSection {
  /**
   * Unique identifier for the section
   */
  id: string;
  
  /**
   * Human-readable name of the section
   */
  name: string;
  
  /**
   * Section start time in milliseconds
   */
  startTime: number;
  
  /**
   * Section end time in milliseconds
   */
  endTime: number;
  
  /**
   * Notes within this section
   */
  notes: Note[];
}

/**
 * Metadata for a pattern
 */
export interface PatternMetadata {
  /**
   * Title of the pattern
   */
  title: string;
  
  /**
   * Artist who created the pattern
   */
  artist?: string;
  
  /**
   * Creator of the pattern file
   */
  creator?: string;
  
  /**
   * Difficulty level of the pattern
   */
  difficulty: DifficultyLevel;
  
  /**
   * Tempo in beats per minute
   */
  bpm: number;
  
  /**
   * Time signature (e.g., "4/4")
   */
  timeSignature: string;
  
  /**
   * Tags for the pattern
   */
  tags?: string[];
  
  /**
   * Additional metadata
   */
  [key: string]: any;
}

/**
 * Complete pattern definition
 */
export interface Pattern {
  /**
   * Unique identifier for the pattern
   */
  id: string;
  
  /**
   * Version of the pattern format
   */
  version: string;
  
  /**
   * Pattern metadata
   */
  metadata: PatternMetadata;
  
  /**
   * Total duration of the pattern in milliseconds
   */
  duration: number;
  
  /**
   * Sections within the pattern
   */
  sections?: PatternSection[];
  
  /**
   * All notes in the pattern (if not using sections)
   */
  notes?: Note[];
  
  /**
   * Path to the audio file for this pattern (if applicable)
   */
  audioFile?: string;
}

/**
 * Format for storing a pattern in JSON
 */
export interface PatternFile {
  /**
   * Pattern data
   */
  pattern: Pattern;
}

/**
 * Options for the pattern loader
 */
export interface PatternLoaderOptions {
  /**
   * Base path for pattern files
   */
  basePath?: string;
  
  /**
   * Whether to validate patterns on load
   */
  validate?: boolean;
  
  /**
   * Default version to use for patterns without a version
   */
  defaultVersion?: string;
  
  /**
   * Whether to enable cache for loaded patterns
   */
  enableCache?: boolean;
  
  /**
   * Maximum size of the pattern cache
   */
  cacheSize?: number;
} 