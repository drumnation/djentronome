import {
  Pattern,
  PatternFile,
  PatternLoaderOptions,
  ValidationResult
} from './types';
import { PatternCache } from './pattern-cache';
import { PatternValidator } from './pattern-validator';

/**
 * Default options for PatternLoader
 */
const DEFAULT_OPTIONS: PatternLoaderOptions = {
  basePath: '',
  validate: false,
  defaultVersion: '1.0',
  enableCache: false,
  cacheSize: 10
};

/**
 * Class for loading rhythm patterns from various sources
 * 
 * This class is part of a modular design where:
 * - PatternLoader handles loading patterns from sources
 * - PatternCache handles caching for performance
 * - PatternValidator handles validation logic
 * 
 * Benefits of this separation:
 * - Each class has a single responsibility (SRP)
 * - Improved testability of each component
 * - Better code organization and maintainability
 * - Easier to extend with new features
 */
export class PatternLoader {
  private options: PatternLoaderOptions;
  private cache: PatternCache;
  private validator: PatternValidator;

  /**
   * Create a new PatternLoader
   * 
   * @param options - Options for pattern loading
   */
  constructor(options: PatternLoaderOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.cache = new PatternCache(this.options.cacheSize);
    this.validator = new PatternValidator();
  }

  /**
   * Load a pattern from a file path
   * 
   * @param path - Path to the pattern file
   * @returns Promise resolving to the loaded pattern
   * @throws Error if pattern loading fails or validation fails
   */
  async loadPattern(path: string): Promise<Pattern> {
    try {
      // Check cache first if enabled
      if (this.options.enableCache) {
        const cachedPattern = this.cache.get(path);
        if (cachedPattern) {
          return cachedPattern;
        }
      }

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
          // For a more detailed error, include the first few validation errors
          const errorDetails = validation.errors.slice(0, 3).join(', ');
          throw new Error(`Invalid pattern: ${errorDetails}${validation.errors.length > 3 ? `, and ${validation.errors.length - 3} more errors` : ''}`);
        }
      }
      
      // Add to cache if enabled
      if (this.options.enableCache) {
        this.cache.add(path, pattern);
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
   * 
   * @param data - Partial pattern data
   * @returns Complete pattern object with defaults applied
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
   * 
   * @param pattern - The pattern to validate
   * @returns ValidationResult with valid flag and any errors
   */
  validatePattern(pattern: Pattern): ValidationResult {
    return this.validator.validatePattern(pattern);
  }

  /**
   * Clear the pattern cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Remove a specific pattern from the cache
   * 
   * @param path - The pattern file path
   * @returns true if the pattern was in the cache and was removed
   */
  removeFromCache(path: string): boolean {
    return this.cache.remove(path);
  }

  /**
   * Get number of patterns in cache
   * 
   * @returns The current number of cached patterns
   */
  getCacheSize(): number {
    return this.cache.size();
  }
} 