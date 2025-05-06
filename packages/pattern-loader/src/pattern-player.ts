import { Pattern, Note } from './types';
import { PatternLoader } from './pattern-loader';
import { PatternUtils } from './pattern-utils';

/**
 * Simple event emitter implementation for pattern player
 */
class EventEmitter {
  private events: Map<string, Array<(data: any) => void>> = new Map();
  
  /**
   * Register an event listener
   */
  on(event: string, listener: (data: any) => void): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    
    const eventListeners = this.events.get(event);
    if (eventListeners) {
      eventListeners.push(listener);
    }
  }
  
  /**
   * Remove an event listener
   */
  off(event: string, listener: (data: any) => void): void {
    if (!this.events.has(event)) {
      return;
    }
    
    const eventListeners = this.events.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(listener);
      if (index !== -1) {
        eventListeners.splice(index, 1);
      }
    }
  }
  
  /**
   * Emit an event
   */
  emit(event: string, data: any): void {
    if (!this.events.has(event)) {
      return;
    }
    
    const eventListeners = this.events.get(event);
    if (eventListeners) {
      eventListeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for "${event}":`, error);
        }
      });
    }
  }
}

/**
 * Events emitted by the PatternPlayer
 */
export enum PatternPlayerEventType {
  LOADED = 'pattern_loaded',
  STARTED = 'pattern_started',
  PAUSED = 'pattern_paused',
  RESUMED = 'pattern_resumed',
  STOPPED = 'pattern_stopped',
  COMPLETED = 'pattern_completed',
  NOTE_TRIGGERED = 'note_triggered',
  SECTION_CHANGED = 'section_changed',
  ERROR = 'pattern_error'
}

/**
 * PatternPlayer event data
 */
export interface PatternPlayerEvent {
  type: PatternPlayerEventType;
  data?: any;
  timestamp: number;
}

/**
 * Options for the PatternPlayer
 */
export interface PatternPlayerOptions {
  /**
   * Auto-start playback when pattern is loaded
   */
  autoStart?: boolean;
  
  /**
   * Initial playback rate (1.0 = normal speed)
   */
  playbackRate?: number;
  
  /**
   * Time offset in milliseconds to apply to patterns
   */
  timeOffset?: number;
  
  /**
   * Whether to loop the pattern
   */
  loop?: boolean;
  
  /**
   * Time in milliseconds to look ahead for upcoming notes
   */
  lookAheadTime?: number;
  
  /**
   * Buffer time in milliseconds to ensure notes are triggered slightly early
   */
  triggerBuffer?: number;
}

/**
 * Default options for PatternPlayer
 */
const DEFAULT_OPTIONS: PatternPlayerOptions = {
  autoStart: false,
  playbackRate: 1.0,
  timeOffset: 0,
  loop: false,
  lookAheadTime: 1000,
  triggerBuffer: 5
};

/**
 * Class for playing rhythm patterns synchronized with the game loop
 * 
 * This class bridges the gap between the pattern-loader and game-loop packages,
 * providing synchronized playback of rhythm patterns according to the game time.
 */
export class PatternPlayer {
  private eventEmitter: EventEmitter;
  private options: Required<PatternPlayerOptions>;
  private patternLoader: PatternLoader;
  private pattern: Pattern | null = null;
  private adjustedPattern: Pattern | null = null;
  private isPlaying: boolean = false;
  private isPaused: boolean = false;
  // Kept for future implementations that will use it for real-time playback synchronization
  // When implemented, will track absolute game time when playback started
  // @ts-ignore: Intentionally unused variable kept for future implementation
  private _startTime: number = 0;
  private currentTime: number = 0;
  private upcomingNotes: Note[] = [];
  private triggeredNotes: Set<number> = new Set();
  private currentSectionIndex: number = -1;
  
  /**
   * Create a new PatternPlayer
   * 
   * @param patternLoader - Optional PatternLoader instance (creates a new one if not provided)
   * @param options - Pattern player options
   */
  constructor(patternLoader?: PatternLoader, options: PatternPlayerOptions = {}) {
    this.eventEmitter = new EventEmitter();
    this.options = { ...DEFAULT_OPTIONS, ...options } as Required<PatternPlayerOptions>;
    this.patternLoader = patternLoader || new PatternLoader();
  }
  
  /**
   * Load a pattern from a file path
   * 
   * @param path - Path to the pattern file
   * @returns Promise that resolves when the pattern is loaded
   */
  async loadPatternFromPath(path: string): Promise<Pattern> {
    try {
      const pattern = await this.patternLoader.loadPattern(path);
      this.loadPattern(pattern);
      return pattern;
    } catch (error) {
      this.emitEvent({
        type: PatternPlayerEventType.ERROR,
        data: { error, message: `Failed to load pattern from path: ${path}` },
        timestamp: Date.now()
      });
      throw error;
    }
  }
  
  /**
   * Load a pattern directly
   * 
   * @param pattern - Pattern to load
   */
  loadPattern(pattern: Pattern): void {
    this.reset();
    this.pattern = pattern;
    
    // Apply time offset and playback rate adjustments if needed
    if (this.options.timeOffset !== 0 || this.options.playbackRate !== 1.0) {
      this.adjustedPattern = this.applyPatternAdjustments(pattern);
    } else {
      this.adjustedPattern = pattern;
    }
    
    // Initialize upcoming notes
    this.refreshUpcomingNotes(0);
    
    this.emitEvent({
      type: PatternPlayerEventType.LOADED,
      data: { pattern: this.pattern },
      timestamp: Date.now()
    });
    
    // Auto-start if configured
    if (this.options.autoStart) {
      this.start();
    }
  }
  
  /**
   * Apply time offset and playback rate adjustments to a pattern
   * 
   * @param pattern - The original pattern
   * @returns Adjusted pattern
   */
  private applyPatternAdjustments(pattern: Pattern): Pattern {
    // First apply time offset
    let adjustedPattern = this.options.timeOffset !== 0
      ? PatternUtils.offsetPattern(pattern, this.options.timeOffset)
      : pattern;
    
    // Then apply playback rate if different from 1.0
    if (this.options.playbackRate !== 1.0 && this.options.playbackRate > 0) {
      // Inverse ratio for tempo, e.g., 0.5 playback rate = 2.0 tempo ratio
      const tempoRatio = 1 / this.options.playbackRate;
      adjustedPattern = PatternUtils.scalePatternTempo(adjustedPattern, tempoRatio);
    }
    
    return adjustedPattern;
  }
  
  /**
   * Start playback from the beginning
   */
  start(): void {
    if (!this.adjustedPattern) {
      this.emitEvent({
        type: PatternPlayerEventType.ERROR,
        data: { message: 'No pattern loaded' },
        timestamp: Date.now()
      });
      return;
    }
    
    if (this.isPlaying && !this.isPaused) {
      return; // Already playing
    }
    
    this.isPlaying = true;
    this.isPaused = false;
    this._startTime = Date.now();
    this.currentTime = 0;
    this.triggeredNotes = new Set();
    this.refreshUpcomingNotes(0);
    this.currentSectionIndex = -1;
    
    this.emitEvent({
      type: PatternPlayerEventType.STARTED,
      data: { pattern: this.pattern },
      timestamp: Date.now()
    });
  }
  
  /**
   * Pause playback
   */
  pause(): void {
    if (!this.isPlaying || this.isPaused) {
      return;
    }
    
    this.isPaused = true;
    
    this.emitEvent({
      type: PatternPlayerEventType.PAUSED,
      timestamp: Date.now()
    });
  }
  
  /**
   * Resume playback from current position
   */
  resume(): void {
    if (!this.isPlaying || !this.isPaused) {
      return;
    }
    
    this.isPaused = false;
    
    this.emitEvent({
      type: PatternPlayerEventType.RESUMED,
      timestamp: Date.now()
    });
  }
  
  /**
   * Stop playback
   */
  stop(): void {
    if (!this.isPlaying) {
      return;
    }
    
    this.isPlaying = false;
    this.isPaused = false;
    
    this.emitEvent({
      type: PatternPlayerEventType.STOPPED,
      timestamp: Date.now()
    });
  }
  
  /**
   * Reset the player state
   */
  reset(): void {
    this.isPlaying = false;
    this.isPaused = false;
    this._startTime = 0;
    this.currentTime = 0;
    this.upcomingNotes = [];
    this.triggeredNotes = new Set();
    this.currentSectionIndex = -1;
  }
  
  /**
   * Update playback state based on the game time
   * 
   * This method should be called on each game update frame
   * 
   * @param gameTime - Current game time in seconds
   */
  update(gameTime: number): void {
    if (!this.isPlaying || this.isPaused || !this.adjustedPattern) {
      return;
    }
    
    // Convert game time to milliseconds for pattern timing
    const timeMs = gameTime * 1000;
    this.currentTime = timeMs;
    
    // Check for pattern completion
    if (timeMs >= this.adjustedPattern.duration) {
      if (this.options.loop) {
        // Loop back to the beginning
        this.currentTime = timeMs % this.adjustedPattern.duration;
        this.triggeredNotes = new Set();
        this.refreshUpcomingNotes(this.currentTime);
        this.currentSectionIndex = -1;
      } else {
        // Pattern playback complete
        this.complete();
        return;
      }
    }
    
    // Trigger notes that should be played at this time
    this.triggerNotes(this.currentTime);
    
    // Check for section changes
    this.checkSectionChange(this.currentTime);
    
    // Refresh upcoming notes if needed
    // Check if upcomingNotes is empty or if we need to load more notes
    const lastNoteTime = this.upcomingNotes.length > 0 
      ? this.upcomingNotes[this.upcomingNotes.length - 1]?.time
      : undefined;
      
    if (this.upcomingNotes.length === 0 || 
        (lastNoteTime !== undefined && 
         this.currentTime + this.options.lookAheadTime > lastNoteTime)) {
      this.refreshUpcomingNotes(this.currentTime);
    }
  }
  
  /**
   * Trigger notes that should be played at the current time
   * 
   * @param currentTime - Current time in milliseconds
   */
  private triggerNotes(currentTime: number): void {
    if (!this.adjustedPattern) {
      return;
    }
    
    const triggerTime = currentTime + this.options.triggerBuffer;
    
    // Check upcoming notes
    for (let i = 0; i < this.upcomingNotes.length; i++) {
      const note = this.upcomingNotes[i];
      
      // Skip notes that are too far in the future or undefined
      if (!note || note.time > triggerTime) {
        continue;
      }
      
      // Create a unique ID for the note
      const noteId = this.getNoteUniqueId(note);
      
      // Skip notes that have already been triggered
      if (this.triggeredNotes.has(noteId)) {
        continue;
      }
      
      // Mark note as triggered
      this.triggeredNotes.add(noteId);
      
      // Emit note triggered event
      this.emitEvent({
        type: PatternPlayerEventType.NOTE_TRIGGERED,
        data: { note },
        timestamp: Date.now()
      });
    }
    
    // Remove notes that are no longer upcoming (past the current time)
    this.upcomingNotes = this.upcomingNotes.filter(note => note && note.time > currentTime);
  }
  
  /**
   * Generate a unique ID for a note
   * 
   * @param note - The note
   * @returns A unique ID for the note
   */
  private getNoteUniqueId(note: Note): number {
    // Use time * 10000 + midiNote as unique ID
    return note.time * 10000 + (note.midiNote || 0);
  }
  
  /**
   * Check if the current time has entered a new section
   * 
   * @param currentTime - Current time in milliseconds
   */
  private checkSectionChange(currentTime: number): void {
    if (!this.adjustedPattern || !this.adjustedPattern.sections) {
      return;
    }
    
    const sections = this.adjustedPattern.sections;
    
    // Find the current section
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      
      if (section && currentTime >= section.startTime && 
          currentTime < section.endTime && 
          i !== this.currentSectionIndex) {
        // Section changed
        this.currentSectionIndex = i;
        
        this.emitEvent({
          type: PatternPlayerEventType.SECTION_CHANGED,
          data: { section, index: i },
          timestamp: Date.now()
        });
        
        break;
      }
    }
  }
  
  /**
   * Refresh the list of upcoming notes
   * 
   * @param currentTime - Current time in milliseconds
   */
  private refreshUpcomingNotes(currentTime: number): void {
    if (!this.adjustedPattern) {
      return;
    }
    
    const lookAheadEnd = currentTime + this.options.lookAheadTime;
    const notesInRange = PatternUtils.getNotesInRange(
      this.adjustedPattern, 
      currentTime, 
      lookAheadEnd
    );
    
    this.upcomingNotes = notesInRange || [];
  }
  
  /**
   * Mark the pattern as complete
   */
  private complete(): void {
    this.isPlaying = false;
    
    this.emitEvent({
      type: PatternPlayerEventType.COMPLETED,
      data: { pattern: this.pattern },
      timestamp: Date.now()
    });
  }
  
  /**
   * Set the playback rate
   * 
   * @param rate - Playback rate (1.0 = normal speed)
   */
  setPlaybackRate(rate: number): void {
    if (rate <= 0) {
      this.emitEvent({
        type: PatternPlayerEventType.ERROR,
        data: { message: 'Playback rate must be positive' },
        timestamp: Date.now()
      });
      return;
    }
    
    // Store current time before adjustment
    const currentTimeBeforeAdjustment = this.currentTime;
    
    // Update playback rate
    this.options.playbackRate = rate;
    
    // Re-apply adjustments if we have a pattern
    if (this.pattern) {
      this.adjustedPattern = this.applyPatternAdjustments(this.pattern);
      
      // Refresh upcoming notes based on new adjusted pattern
      this.refreshUpcomingNotes(currentTimeBeforeAdjustment);
    }
  }
  
  /**
   * Get the current pattern
   * 
   * @returns The current pattern or null if none is loaded
   */
  getPattern(): Pattern | null {
    return this.pattern;
  }
  
  /**
   * Get the current playback state
   * 
   * @returns Object containing current playback state
   */
  getPlaybackState(): { 
    isPlaying: boolean; 
    isPaused: boolean; 
    currentTime: number; 
    playbackRate: number;
    duration: number; 
  } {
    return {
      isPlaying: this.isPlaying,
      isPaused: this.isPaused,
      currentTime: this.currentTime,
      playbackRate: this.options.playbackRate,
      duration: this.adjustedPattern?.duration || 0
    };
  }
  
  /**
   * Add an event listener
   * 
   * @param type - Event type to listen for
   * @param listener - Callback function
   */
  addEventListener(type: PatternPlayerEventType, listener: (event: PatternPlayerEvent) => void): void {
    this.eventEmitter.on(type, listener);
  }
  
  /**
   * Remove an event listener
   * 
   * @param type - Event type
   * @param listener - Callback function
   */
  removeEventListener(type: PatternPlayerEventType, listener: (event: PatternPlayerEvent) => void): void {
    this.eventEmitter.off(type, listener);
  }
  
  /**
   * Emit an event
   * 
   * @param event - The event to emit
   */
  private emitEvent(event: PatternPlayerEvent): void {
    this.eventEmitter.emit(event.type, event);
  }
  
  /**
   * Set the time in milliseconds to look ahead for upcoming notes
   * 
   * @param lookAheadTime - Look ahead time in milliseconds
   */
  setLookAheadTime(lookAheadTime: number): void {
    if (lookAheadTime > 0) {
      this.options = {
        ...DEFAULT_OPTIONS,
        ...this.options,
        lookAheadTime
      } as Required<PatternPlayerOptions>;
    }
  }
  
  /**
   * Set the buffer time in milliseconds to ensure notes are triggered slightly early
   * 
   * @param triggerBuffer - Trigger buffer in milliseconds
   */
  setTriggerBuffer(triggerBuffer: number): void {
    if (triggerBuffer >= 0) {
      this.options = {
        ...DEFAULT_OPTIONS,
        ...this.options,
        triggerBuffer
      } as Required<PatternPlayerOptions>;
    }
  }
} 