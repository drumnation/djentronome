/**
 * Rhythm Engine Types
 */

import { Note, Pattern } from '@djentronome/pattern-loader';
import { MIDIMessage } from '@djentronome/core-midi';

/**
 * Accuracy rating for a hit
 */
export enum HitAccuracy {
  PERFECT = 'perfect',
  GREAT = 'great',
  GOOD = 'good',
  OKAY = 'okay',
  MISS = 'miss'
}

/**
 * Result of a hit attempt
 */
export interface HitResult {
  /**
   * Whether the hit was successful (not a miss)
   */
  hit: boolean;
  
  /**
   * Accuracy rating of the hit
   */
  accuracy: HitAccuracy;
  
  /**
   * Time difference between the expected and actual hit time (in ms)
   */
  timeDelta: number;
  
  /**
   * Score points awarded for this hit
   */
  points: number;
  
  /**
   * The note that was hit or attempted to be hit
   */
  note: Note;
  
  /**
   * Timestamp when the hit was recorded
   */
  timestamp: number;
  
  /**
   * MIDI message that triggered this hit (if applicable)
   */
  midiMessage?: MIDIMessage;
  
  /**
   * Additional metadata for the hit
   */
  metadata?: Record<string, any>;
}

/**
 * Type for scoring configurations
 */
export interface ScoringConfig {
  /**
   * Base points for a perfect hit
   */
  perfectPoints: number;
  
  /**
   * Base points for a great hit
   */
  greatPoints: number;
  
  /**
   * Base points for a good hit
   */
  goodPoints: number;
  
  /**
   * Base points for an okay hit
   */
  okayPoints: number;
  
  /**
   * Points for a miss (usually 0 or negative)
   */
  missPoints: number;
  
  /**
   * Time window (in ms) for a perfect hit
   */
  perfectWindow: number;
  
  /**
   * Time window (in ms) for a great hit
   */
  greatWindow: number;
  
  /**
   * Time window (in ms) for a good hit
   */
  goodWindow: number;
  
  /**
   * Time window (in ms) for an okay hit
   */
  okayWindow: number;
  
  /**
   * Additional scoring multipliers
   */
  multipliers?: {
    /**
     * Combo multiplier formula or function
     */
    combo?: (combo: number) => number;
    
    /**
     * Difficulty multiplier
     */
    difficulty?: number;
    
    /**
     * Custom multipliers
     */
    [key: string]: any;
  };
}

/**
 * Gameplay statistics
 */
export interface GameStats {
  /**
   * Total score
   */
  score: number;
  
  /**
   * Current combo count
   */
  combo: number;
  
  /**
   * Maximum combo achieved
   */
  maxCombo: number;
  
  /**
   * Count of perfect hits
   */
  perfectCount: number;
  
  /**
   * Count of great hits
   */
  greatCount: number;
  
  /**
   * Count of good hits
   */
  goodCount: number;
  
  /**
   * Count of okay hits
   */
  okayCount: number;
  
  /**
   * Count of misses
   */
  missCount: number;
  
  /**
   * Total notes in the pattern
   */
  totalNotes: number;
  
  /**
   * Notes hit so far
   */
  notesHit: number;
  
  /**
   * Current accuracy percentage
   */
  accuracy: number;
  
  /**
   * Current progress through the pattern (0-1)
   */
  progress: number;
  
  /**
   * Additional game statistics
   */
  [key: string]: any;
}

/**
 * Current game state
 */
export enum GameState {
  IDLE = 'idle',
  CALIBRATING = 'calibrating',
  COUNTDOWN = 'countdown',
  PLAYING = 'playing',
  PAUSED = 'paused',
  GAME_OVER = 'gameOver'
}

/**
 * Options for the rhythm engine
 */
export interface RhythmEngineOptions {
  /**
   * Scoring configuration
   */
  scoringConfig?: Partial<ScoringConfig>;
  
  /**
   * Latency offset in milliseconds
   */
  latencyOffset?: number;
  
  /**
   * Whether to automatically handle missed notes
   */
  autoHandleMisses?: boolean;
  
  /**
   * Time in the future to look for upcoming notes (ms)
   */
  lookAheadTime?: number;
  
  /**
   * Additional options
   */
  [key: string]: any;
}

/**
 * Input event for the rhythm engine
 */
export interface InputEvent {
  /**
   * Type of input (midi, keyboard, etc.)
   */
  type: string;
  
  /**
   * Input value (note number, key code, etc.)
   */
  value: any;
  
  /**
   * Timestamp when the event occurred
   */
  timestamp: number;
  
  /**
   * Velocity or intensity (0-1)
   */
  velocity?: number;
  
  /**
   * Original event that triggered this input
   */
  originalEvent?: any;
}

/**
 * Event emitted by the rhythm engine
 */
export interface RhythmEngineEvent {
  /**
   * Type of event
   */
  type: RhythmEngineEventType;
  
  /**
   * Event data
   */
  data: any;
  
  /**
   * Timestamp when the event occurred
   */
  timestamp: number;
}

/**
 * Types of events emitted by the rhythm engine
 */
export enum RhythmEngineEventType {
  HIT = 'hit',
  MISS = 'miss',
  GAME_STATE_CHANGED = 'gameStateChanged',
  PATTERN_LOADED = 'patternLoaded',
  PATTERN_STARTED = 'patternStarted',
  PATTERN_COMPLETED = 'patternCompleted',
  SECTION_CHANGED = 'sectionChanged',
  STATS_UPDATED = 'statsUpdated',
  ERROR = 'error'
} 