import { Pattern, PatternSection, Note } from './types';

/**
 * Utility functions for pattern manipulation
 */
export class PatternUtils {
  /**
   * Get all notes from a pattern (either directly or from sections)
   */
  static getAllNotes(pattern: Pattern): Note[] {
    if (pattern.notes) {
      return [...pattern.notes];
    }
    
    if (pattern.sections) {
      return pattern.sections.reduce<Note[]>((allNotes, section) => {
        return allNotes.concat(section.notes);
      }, []);
    }
    
    return [];
  }
  
  /**
   * Get notes within a specific time range
   */
  static getNotesInRange(pattern: Pattern, startTime: number, endTime: number): Note[] {
    const allNotes = this.getAllNotes(pattern);
    return allNotes.filter(note => note.time >= startTime && note.time < endTime);
  }
  
  /**
   * Get notes of a specific type
   */
  static getNotesByType(pattern: Pattern, type: string): Note[] {
    const allNotes = this.getAllNotes(pattern);
    return allNotes.filter(note => note.type === type);
  }
  
  /**
   * Get notes by MIDI note number
   */
  static getNotesByMidiNote(pattern: Pattern, midiNote: number): Note[] {
    const allNotes = this.getAllNotes(pattern);
    return allNotes.filter(note => note.midiNote === midiNote);
  }
  
  /**
   * Get a section by ID
   */
  static getSectionById(pattern: Pattern, sectionId: string): PatternSection | undefined {
    return pattern.sections?.find(section => section.id === sectionId);
  }
  
  /**
   * Create a new pattern with a time offset applied to all notes
   */
  static offsetPattern(pattern: Pattern, timeOffset: number): Pattern {
    const result: Pattern = { ...pattern };
    
    if (pattern.notes) {
      result.notes = pattern.notes.map(note => ({
        ...note,
        time: note.time + timeOffset
      }));
    }
    
    if (pattern.sections) {
      result.sections = pattern.sections.map(section => ({
        ...section,
        startTime: section.startTime + timeOffset,
        endTime: section.endTime + timeOffset,
        notes: section.notes.map(note => ({
          ...note,
          time: note.time + timeOffset
        }))
      }));
    }
    
    return result;
  }
  
  /**
   * Merge multiple patterns into a single pattern
   */
  static mergePatterns(patterns: Pattern[], options: { preserveSections?: boolean } = {}): Pattern {
    if (patterns.length === 0) {
      throw new Error('Cannot merge empty pattern array');
    }
    
    if (patterns.length === 1) {
      // Clone the pattern with explicit typing to avoid type errors
      const pattern = patterns[0];
      // Safe to assert pattern exists since we've checked length > 0
      const result: Pattern = {
        id: pattern.id,
        version: pattern.version,
        metadata: { ...pattern.metadata },
        duration: pattern.duration,
        notes: pattern.notes ? [...pattern.notes] : undefined,
        sections: pattern.sections ? [...pattern.sections] : undefined,
        audioFile: pattern.audioFile
      };
      return result;
    }
    
    // Use the first pattern as the base which we know exists since length > 0
    const basePattern = patterns[0];
    
    // Create the merged pattern with required fields
    const result: Pattern = {
      id: `merged-${basePattern.id}`,
      version: basePattern.version,
      metadata: { ...basePattern.metadata },
      duration: 0, // Will be calculated
      notes: []
    };
    
    // Initialize sections if preserving them
    if (options.preserveSections) {
      result.sections = [];
    }
    
    let currentTime = 0;
    
    // Process each pattern
    for (const pattern of patterns) {
      if (options.preserveSections && pattern.sections) {
        // Add sections with adjusted times
        const offsetSections = pattern.sections.map(section => ({
          ...section,
          id: `${pattern.id}-${section.id}`,
          startTime: section.startTime + currentTime,
          endTime: section.endTime + currentTime,
          notes: section.notes.map(note => ({
            ...note,
            time: note.time + currentTime
          }))
        }));
        
        if (result.sections) {
          result.sections = result.sections.concat(offsetSections);
        }
      } else {
        // Get all notes and add them with adjusted times
        const allNotes = this.getAllNotes(pattern).map(note => ({
          ...note,
          time: note.time + currentTime
        }));
        
        if (result.notes) {
          result.notes = result.notes.concat(allNotes);
        }
      }
      
      // Update the current time for the next pattern
      currentTime += pattern.duration;
    }
    
    // Set the total duration
    result.duration = currentTime;
    
    return result;
  }
  
  /**
   * Filter a pattern to only include certain note types
   */
  static filterNoteTypes(pattern: Pattern, includeTypes: string[]): Pattern {
    const result: Pattern = { ...pattern };
    
    if (pattern.notes) {
      result.notes = pattern.notes.filter(note => includeTypes.includes(note.type));
    }
    
    if (pattern.sections) {
      result.sections = pattern.sections.map(section => ({
        ...section,
        notes: section.notes.filter(note => includeTypes.includes(note.type))
      }));
    }
    
    return result;
  }
  
  /**
   * Scale the tempo of a pattern
   */
  static scalePatternTempo(pattern: Pattern, tempoRatio: number): Pattern {
    if (tempoRatio <= 0) {
      throw new Error('Tempo ratio must be positive');
    }
    
    const result: Pattern = { 
      ...pattern,
      metadata: {
        ...pattern.metadata,
        bpm: pattern.metadata.bpm * tempoRatio
      },
      duration: Math.round(pattern.duration / tempoRatio)
    };
    
    if (pattern.notes) {
      result.notes = pattern.notes.map(note => ({
        ...note,
        time: Math.round(note.time / tempoRatio),
        duration: note.duration ? Math.round(note.duration / tempoRatio) : undefined
      }));
    }
    
    if (pattern.sections) {
      result.sections = pattern.sections.map(section => ({
        ...section,
        startTime: Math.round(section.startTime / tempoRatio),
        endTime: Math.round(section.endTime / tempoRatio),
        notes: section.notes.map(note => ({
          ...note,
          time: Math.round(note.time / tempoRatio),
          duration: note.duration ? Math.round(note.duration / tempoRatio) : undefined
        }))
      }));
    }
    
    return result;
  }
  
  /**
   * Convert a flat list of notes to a sectioned pattern
   */
  static createSectionsFromNotes(
    pattern: Pattern, 
    sectionDefinitions: { id: string; name: string; startTime: number; endTime: number }[]
  ): Pattern {
    if (!pattern.notes || pattern.notes.length === 0) {
      throw new Error('Pattern must have notes to create sections');
    }
    
    // Create a new pattern with sections
    const result: Pattern = {
      ...pattern,
      sections: sectionDefinitions.map(definition => {
        // Get notes for this section
        const sectionNotes = pattern.notes!.filter(
          note => note.time >= definition.startTime && note.time < definition.endTime
        );
        
        return {
          id: definition.id,
          name: definition.name,
          startTime: definition.startTime,
          endTime: definition.endTime,
          notes: sectionNotes
        };
      }),
      notes: undefined // Remove flat notes list
    };
    
    return result;
  }
  
  /**
   * Convert a sectioned pattern to a flat list of notes
   */
  static flattenSections(pattern: Pattern): Pattern {
    if (!pattern.sections || pattern.sections.length === 0) {
      return { ...pattern };
    }
    
    // Create a new pattern with a flat list of notes
    const result: Pattern = {
      ...pattern,
      notes: this.getAllNotes(pattern),
      sections: undefined // Remove sections
    };
    
    return result;
  }
} 