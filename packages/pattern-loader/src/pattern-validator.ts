import {
  Pattern,
  ValidationResult,
  ValidationError,
  ValidationErrorType,
  DifficultyLevel,
  PatternSection
} from './types';

/**
 * Class for validating rhythm patterns
 * 
 * This class is part of a modular design where:
 * - PatternLoader handles loading patterns from sources
 * - PatternCache handles caching for performance
 * - PatternValidator handles validation logic
 * 
 * Benefits of this separation:
 * - Complex validation logic is isolated from loading concerns
 * - Easier testing of validation logic in isolation
 * - Validation rules can be extended or modified without affecting loading
 * - Clear separation of concerns leads to more maintainable code
 */
export class PatternValidator {
  /**
   * Validate a pattern object
   * 
   * @param pattern - The pattern to validate
   * @returns ValidationResult with valid flag and any errors
   */
  validatePattern(pattern: Pattern): ValidationResult {
    const errors: string[] = [];
    const detailedErrors: ValidationError[] = [];
    
    this.validateBasicFields(pattern, errors, detailedErrors);
    this.validateMetadata(pattern, errors, detailedErrors);
    this.validateContent(pattern, errors, detailedErrors);
    
    if (pattern.sections && pattern.sections.length > 0) {
      this.validateSections(pattern.sections, errors, detailedErrors);
    }
    
    if (pattern.notes && pattern.notes.length > 0) {
      this.validateNotes(pattern.notes, errors, detailedErrors);
    }
    
    const valid = errors.length === 0;
    
    return {
      valid,
      errors,
      ...(valid ? {} : { detailedErrors })
    };
  }

  /**
   * Validate basic required fields
   * 
   * @param pattern - The pattern to validate
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateBasicFields(
    pattern: Pattern,
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    // Check required top-level fields
    this.validateRequiredField(pattern, 'id', errors, detailedErrors);
    this.validateRequiredField(pattern, 'version', errors, detailedErrors);
    this.validateRequiredField(pattern, 'duration', errors, detailedErrors);
    
    // Check duration is positive
    if (pattern.duration !== undefined && pattern.duration <= 0) {
      const error = new ValidationError(
        'Invalid value for "duration": must be positive',
        ValidationErrorType.INVALID_VALUE,
        'duration',
        'Duration must be a positive number in milliseconds'
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    // Check that at least one of notes or sections is provided
    if (!pattern.notes && !pattern.sections) {
      const error = new ValidationError(
        'Pattern must have either notes or sections',
        ValidationErrorType.STRUCTURAL_ERROR,
        '',
        'A pattern must contain either a notes array or sections array'
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
  }

  /**
   * Validate pattern metadata
   * 
   * @param pattern - The pattern to validate
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateMetadata(
    pattern: Pattern,
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    if (!pattern.metadata) {
      const error = new ValidationError(
        'Missing required field "metadata"',
        ValidationErrorType.MISSING_FIELD,
        'metadata'
      );
      errors.push(error.message);
      detailedErrors.push(error);
      return;
    }
    
    // Check required metadata fields
    this.validateRequiredField(pattern.metadata, 'title', errors, detailedErrors, 'metadata.');
    this.validateRequiredField(pattern.metadata, 'difficulty', errors, detailedErrors, 'metadata.');
    this.validateRequiredField(pattern.metadata, 'bpm', errors, detailedErrors, 'metadata.');
    this.validateRequiredField(pattern.metadata, 'timeSignature', errors, detailedErrors, 'metadata.');
    
    // Validate difficulty is a valid enum value
    if (pattern.metadata.difficulty && !Object.values(DifficultyLevel).includes(pattern.metadata.difficulty)) {
      const error = new ValidationError(
        'Invalid value for "difficulty" in metadata',
        ValidationErrorType.INVALID_VALUE,
        'metadata.difficulty',
        `Must be one of: ${Object.values(DifficultyLevel).join(', ')}`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    // Validate BPM is positive
    if (pattern.metadata.bpm !== undefined && pattern.metadata.bpm <= 0) {
      const error = new ValidationError(
        'Invalid value for "bpm" in metadata: must be positive',
        ValidationErrorType.INVALID_VALUE,
        'metadata.bpm',
        'BPM must be a positive number'
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    // Validate time signature format
    if (pattern.metadata.timeSignature && !/^\d+\/\d+$/.test(pattern.metadata.timeSignature)) {
      const error = new ValidationError(
        'Invalid time signature format: must be in format "n/d"',
        ValidationErrorType.FORMAT_ERROR,
        'metadata.timeSignature',
        'Time signature must be in format "n/d", e.g., "4/4"'
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
  }

  /**
   * Validate pattern content requirements
   * 
   * @param pattern - The pattern to validate
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateContent(
    pattern: Pattern,
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    // Add any additional content validation rules here
  }

  /**
   * Validate pattern sections
   * 
   * @param sections - The sections to validate
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateSections(
    sections: PatternSection[],
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    // Check for valid sections and potential overlaps
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      // Skip if section is undefined or null
      if (!section) {
        const error = new ValidationError(
          `Section ${i} is undefined or null`,
          ValidationErrorType.MISSING_FIELD,
          `sections[${i}]`
        );
        errors.push(error.message);
        detailedErrors.push(error);
        continue;
      }
      
      // Use non-null assertion to ensure section is defined
      const section1: PatternSection = section;
      
      // Validate section fields
      this.validateSectionFields(section1, i, errors, detailedErrors);
      
      // Check for overlaps with other sections
      this.checkSectionOverlaps(section1, i, sections, errors, detailedErrors);
    }
  }

  /**
   * Validate individual section fields
   * 
   * @param section - The section to validate
   * @param index - The index of the section in the sections array
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateSectionFields(
    section: PatternSection,
    index: number,
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    if (!section.id) {
      const error = new ValidationError(
        `Section ${index} is missing required field "id"`,
        ValidationErrorType.MISSING_FIELD,
        `sections[${index}].id`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    if (!section.name) {
      const error = new ValidationError(
        `Section ${index} is missing required field "name"`,
        ValidationErrorType.MISSING_FIELD,
        `sections[${index}].name`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    if (section.startTime === undefined) {
      const error = new ValidationError(
        `Section ${index} is missing required field "startTime"`,
        ValidationErrorType.MISSING_FIELD,
        `sections[${index}].startTime`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    if (section.endTime === undefined) {
      const error = new ValidationError(
        `Section ${index} is missing required field "endTime"`,
        ValidationErrorType.MISSING_FIELD,
        `sections[${index}].endTime`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    if (!section.notes) {
      const error = new ValidationError(
        `Section ${index} is missing required field "notes"`,
        ValidationErrorType.MISSING_FIELD,
        `sections[${index}].notes`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    // Check that startTime < endTime
    if (section.startTime !== undefined && section.endTime !== undefined && section.startTime >= section.endTime) {
      const error = new ValidationError(
        `Section ${index} has startTime >= endTime`,
        ValidationErrorType.INVALID_VALUE,
        `sections[${index}]`,
        'Section startTime must be less than endTime'
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
    
    // Validate notes within the section
    if (section.notes && section.notes.length > 0) {
      this.validateSectionNotes(section, index, errors, detailedErrors);
    }
  }

  /**
   * Check for overlapping sections
   * 
   * @param section1 - The section to check for overlaps
   * @param index - The index of the section in the sections array
   * @param sections - All sections to check against
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private checkSectionOverlaps(
    section1: PatternSection,
    index: number,
    sections: PatternSection[],
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    for (let j = index + 1; j < sections.length; j++) {
      const section2 = sections[j];
      
      // Skip if section2 is undefined or null
      if (!section2) continue;
      
      if (
        section1.startTime !== undefined && section1.endTime !== undefined &&
        section2.startTime !== undefined && section2.endTime !== undefined &&
        ((section1.startTime < section2.endTime && section1.endTime > section2.startTime) ||
         (section2.startTime < section1.endTime && section2.endTime > section1.startTime))
      ) {
        const error = new ValidationError(
          `Sections overlap: "${section1.id}" and "${section2.id}"`,
          ValidationErrorType.STRUCTURAL_ERROR,
          'sections',
          'Sections must not overlap in time'
        );
        errors.push(error.message);
        detailedErrors.push(error);
        break;
      }
    }
  }

  /**
   * Validate notes within a section
   * 
   * @param section - The section containing notes
   * @param sectionIndex - The index of the section in the sections array
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateSectionNotes(
    section: PatternSection,
    sectionIndex: number,
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    section.notes.forEach((note, noteIndex) => {
      // Check required note fields
      if (note.time === undefined) {
        const error = new ValidationError(
          `Note ${noteIndex} in section "${section.id}" is missing required field "time"`,
          ValidationErrorType.MISSING_FIELD,
          `sections[${sectionIndex}].notes[${noteIndex}].time`
        );
        errors.push(error.message);
        detailedErrors.push(error);
      }
      
      if (!note.type) {
        const error = new ValidationError(
          `Note ${noteIndex} in section "${section.id}" is missing required field "type"`,
          ValidationErrorType.MISSING_FIELD,
          `sections[${sectionIndex}].notes[${noteIndex}].type`
        );
        errors.push(error.message);
        detailedErrors.push(error);
      }
      
      // Check note time is within section boundaries
      if (
        note.time !== undefined && section.startTime !== undefined && section.endTime !== undefined &&
        (note.time < section.startTime || note.time >= section.endTime)
      ) {
        const error = new ValidationError(
          `Note ${noteIndex} in section "${section.id}" has time outside section boundaries`,
          ValidationErrorType.INVALID_VALUE,
          `sections[${sectionIndex}].notes[${noteIndex}].time`,
          `Note time (${note.time}) must be >= section startTime (${section.startTime}) and < section endTime (${section.endTime})`
        );
        errors.push(error.message);
        detailedErrors.push(error);
      }
    });
  }

  /**
   * Validate pattern notes (outside sections)
   * 
   * @param notes - The notes to validate
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   */
  private validateNotes(
    notes: any[],
    errors: string[],
    detailedErrors: ValidationError[]
  ): void {
    notes.forEach((note, index) => {
      if (note.time === undefined) {
        const error = new ValidationError(
          `Note ${index} is missing required field "time"`,
          ValidationErrorType.MISSING_FIELD,
          `notes[${index}].time`
        );
        errors.push(error.message);
        detailedErrors.push(error);
      }
      
      if (!note.type) {
        const error = new ValidationError(
          `Note ${index} is missing required field "type"`,
          ValidationErrorType.MISSING_FIELD,
          `notes[${index}].type`
        );
        errors.push(error.message);
        detailedErrors.push(error);
      }
    });
  }

  /**
   * Helper method to validate a required field
   * 
   * @param obj - The object to check for the field
   * @param field - The field name to check
   * @param errors - Array to collect error messages
   * @param detailedErrors - Array to collect detailed error objects
   * @param prefix - Optional prefix for field name in error message (e.g., "metadata.")
   */
  private validateRequiredField(
    obj: any, 
    field: string, 
    errors: string[], 
    detailedErrors: ValidationError[],
    prefix = ''
  ): void {
    if (obj[field] === undefined || obj[field] === null) {
      const error = new ValidationError(
        `Missing required field "${field}"${prefix ? ` in ${prefix.slice(0, -1)}` : ''}`,
        ValidationErrorType.MISSING_FIELD,
        `${prefix}${field}`
      );
      errors.push(error.message);
      detailedErrors.push(error);
    }
  }
} 