import {
  Pattern,
  PatternFile,
  PatternLoaderOptions,
} from './types';

/**
 * Default options for PatternLoader
 */
const DEFAULT_OPTIONS: PatternLoaderOptions = {
  basePath: '',
  validate: false,
  defaultVersion: '1.0'
};

/**
 * Result of pattern validation
 */
interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Class for loading rhythm patterns from various sources
 */
export class PatternLoader {
  private options: PatternLoaderOptions;

  /**
   * Create a new PatternLoader
   */
  constructor(options: PatternLoaderOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Load a pattern from a file path
   */
  async loadPattern(path: string): Promise<Pattern> {
    try {
      // Apply base path if provided
      const fullPath = this.options.basePath 
        ? `${this.options.basePath}/${path}`.replace(/\/+/g, '/') 
        : path;
      
      // Fetch the pattern file
      const response = await fetch(fullPath);
      
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      
      // Parse the JSON response
      let patternFile: PatternFile;
      try {
        patternFile = await response.json();
      } catch (error) {
        throw new Error(`Failed to parse pattern file: ${error instanceof Error ? error.message : String(error)}`);
      }
      
      // Get the pattern from the file
      const pattern = patternFile.pattern;
      
      // Validate the pattern if validation is enabled
      if (this.options.validate) {
        const validation = this.validatePattern(pattern);
        if (!validation.valid) {
          throw new Error(`Invalid pattern: ${validation.errors.join(', ')}`);
        }
      }
      
      return pattern;
    } catch (error) {
      // Wrap and re-throw any errors
      if (error instanceof Error) {
        if (error.message.startsWith('Invalid pattern') || 
            error.message.startsWith('Failed to parse')) {
          throw error;
        }
        throw new Error(`Failed to load pattern: ${error.message}`);
      }
      throw new Error(`Failed to load pattern: ${String(error)}`);
    }
  }

  /**
   * Create a pattern object from raw data
   */
  createPattern(data: Partial<Pattern>): Pattern {
    // Apply default version if not provided
    const pattern: Pattern = {
      ...data,
      version: data.version || this.options.defaultVersion || '1.0'
    } as Pattern;
    
    return pattern;
  }

  /**
   * Validate a pattern object
   */
  validatePattern(pattern: Pattern): ValidationResult {
    const errors: string[] = [];
    
    // Check required top-level fields
    if (!pattern.id) errors.push('Missing required field "id"');
    if (!pattern.version) errors.push('Missing required field "version"');
    if (!pattern.duration) errors.push('Missing required field "duration"');
    
    // Check metadata
    if (!pattern.metadata) {
      errors.push('Missing required field "metadata"');
    } else {
      // Check required metadata fields
      if (!pattern.metadata.title) errors.push('Missing required field "title" in metadata');
      if (!pattern.metadata.difficulty) errors.push('Missing required field "difficulty" in metadata');
      if (!pattern.metadata.bpm) errors.push('Missing required field "bpm" in metadata');
      if (!pattern.metadata.timeSignature) errors.push('Missing required field "timeSignature" in metadata');
    }
    
    // Check that at least one of notes or sections is provided
    if (!pattern.notes && !pattern.sections) {
      errors.push('Pattern must have either notes or sections');
    }
    
    // If sections are provided, validate each section
    if (pattern.sections && pattern.sections.length > 0) {
      pattern.sections.forEach((section, index) => {
        if (!section.id) errors.push(`Section ${index} is missing required field "id"`);
        if (!section.name) errors.push(`Section ${index} is missing required field "name"`);
        if (section.startTime === undefined) errors.push(`Section ${index} is missing required field "startTime"`);
        if (section.endTime === undefined) errors.push(`Section ${index} is missing required field "endTime"`);
        if (!section.notes) errors.push(`Section ${index} is missing required field "notes"`);
      });
    }
    
    // If notes are provided, validate each note
    if (pattern.notes && pattern.notes.length > 0) {
      pattern.notes.forEach((note, index) => {
        if (note.time === undefined) errors.push(`Note ${index} is missing required field "time"`);
        if (!note.type) errors.push(`Note ${index} is missing required field "type"`);
      });
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
} 