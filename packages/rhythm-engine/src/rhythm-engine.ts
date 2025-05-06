import {
  HitAccuracy,
  HitResult,
  GameState,
  GameStats,
  ScoringConfig,
  RhythmEngineOptions,
  InputEvent,
  RhythmEngineEvent,
  RhythmEngineEventType
} from './types';
import { Pattern, Note } from '@djentronome/pattern-loader';
import { MIDIHandler, MIDIMessage } from '@djentronome/core-midi';

/**
 * Default scoring configuration
 */
const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  perfectPoints: 100,
  greatPoints: 80,
  goodPoints: 50,
  okayPoints: 30,
  missPoints: 0,
  perfectWindow: 30, // ±30ms
  greatWindow: 60,   // ±60ms
  goodWindow: 90,    // ±90ms
  okayWindow: 120,   // ±120ms
  multipliers: {
    combo: (combo: number) => Math.min(1 + Math.floor(combo / 10) * 0.1, 2.0),
    difficulty: 1.0
  }
};

/**
 * Default options for the rhythm engine
 */
const DEFAULT_OPTIONS: RhythmEngineOptions = {
  scoringConfig: DEFAULT_SCORING_CONFIG,
  latencyOffset: 0,
  autoHandleMisses: true,
  lookAheadTime: 200 // Look 200ms ahead for upcoming notes
};

/**
 * Type for event listeners
 */
type EventListener = (event: RhythmEngineEvent) => void;

/**
 * Core rhythm game engine with hit detection and scoring
 */
export class RhythmEngine {
  private options: Required<RhythmEngineOptions>;
  private pattern: Pattern | null = null;
  private state: GameState = GameState.IDLE;
  private gameLoop: any | null = null; // Will be initialized later
  private listeners: Map<RhythmEngineEventType, EventListener[]> = new Map();
  private stats: GameStats;
  private missWindow: number;
  private lastUpdateTime: number = 0;
  private processedNotes: Set<number> = new Set(); // Indices of notes that have been processed

  /**
   * Create a new RhythmEngine
   */
  constructor(options: RhythmEngineOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options } as Required<RhythmEngineOptions>;
    
    // Merge scoring config
    if (options.scoringConfig) {
      this.options.scoringConfig = {
        ...DEFAULT_SCORING_CONFIG,
        ...options.scoringConfig
      };
    }
    
    // Calculate miss window based on scoring config
    this.missWindow = this.options.scoringConfig.okayWindow;
    
    // Initialize game stats
    this.stats = this.createInitialStats();
    
    // Skip game loop initialization in tests
    if (typeof process === 'undefined' || !process.env.VITEST) {
      this.initGameLoop();
    }
  }

  /**
   * Initialize the game loop if available
   */
  private initGameLoop() {
    try {
      // In a real implementation, we would dynamically import the game loop
      // But for testing, we'll just create a placeholder
      this.gameLoop = {
        start: () => {},
        stop: () => {},
        update: this.update.bind(this)
      };
    } catch (error) {
      console.warn('Failed to initialize game loop:', error);
    }
  }

  /**
   * Load a pattern into the engine
   */
  loadPattern(pattern: Pattern): void {
    this.pattern = pattern;
    this.resetGameState();
    
    this.emitEvent({
      type: RhythmEngineEventType.PATTERN_LOADED,
      data: pattern,
      timestamp: Date.now()
    });
    
    // Also emit a state change event
    this.emitEvent({
      type: RhythmEngineEventType.GAME_STATE_CHANGED,
      data: this.state,
      timestamp: Date.now()
    });
  }

  /**
   * Reset the game state
   */
  private resetGameState(): void {
    this.state = GameState.IDLE;
    this.stats = this.createInitialStats();
    this.processedNotes = new Set();
    this.lastUpdateTime = 0;
    
    // Update total notes count in stats
    if (this.pattern) {
      this.stats.totalNotes = this.pattern.notes?.length || 0;
    }
  }

  /**
   * Create initial game stats
   */
  private createInitialStats(): GameStats {
    return {
      score: 0,
      combo: 0,
      maxCombo: 0,
      perfectCount: 0,
      greatCount: 0,
      goodCount: 0,
      okayCount: 0,
      missCount: 0,
      totalNotes: 0,
      notesHit: 0,
      accuracy: 100,
      progress: 0
    };
  }

  /**
   * Start the rhythm game
   */
  start(): void {
    if (!this.pattern) {
      throw new Error('No pattern loaded');
    }
    
    this.state = GameState.PLAYING;
    
    // Start the game loop if available
    if (this.gameLoop) {
      this.gameLoop.start();
    }
    
    this.emitEvent({
      type: RhythmEngineEventType.PATTERN_STARTED,
      data: this.pattern,
      timestamp: Date.now()
    });
    
    this.emitEvent({
      type: RhythmEngineEventType.GAME_STATE_CHANGED,
      data: this.state,
      timestamp: Date.now()
    });
  }

  /**
   * Pause the game
   */
  pause(): void {
    if (this.state === GameState.PLAYING) {
      this.state = GameState.PAUSED;
      
      // Pause the game loop if available
      if (this.gameLoop) {
        this.gameLoop.stop();
      }
      
      this.emitEvent({
        type: RhythmEngineEventType.GAME_STATE_CHANGED,
        data: this.state,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Resume the paused game
   */
  resume(): void {
    if (this.state === GameState.PAUSED) {
      this.state = GameState.PLAYING;
      
      // Resume the game loop if available
      if (this.gameLoop) {
        this.gameLoop.start();
      }
      
      this.emitEvent({
        type: RhythmEngineEventType.GAME_STATE_CHANGED,
        data: this.state,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Stop the game
   */
  stop(): void {
    this.state = GameState.PAUSED;
    
    // Stop the game loop if available
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    
    this.emitEvent({
      type: RhythmEngineEventType.GAME_STATE_CHANGED,
      data: this.state,
      timestamp: Date.now()
    });
  }

  /**
   * Process an input event (MIDI, keyboard, etc.)
   */
  processInput(input: InputEvent): void {
    if (!this.pattern || !this.pattern.notes) {
      return; // Need a pattern with notes
    }
    
    // Apply latency offset to the input timestamp
    const adjustedTimestamp = input.timestamp - this.options.latencyOffset;
    
    // Find the closest note to the input
    const hitResult = this.detectHit(input, adjustedTimestamp);
    
    if (hitResult) {
      // Update game stats
      this.updateStats(hitResult);
      
      // Emit hit or miss event
      this.emitEvent({
        type: hitResult.hit ? RhythmEngineEventType.HIT : RhythmEngineEventType.MISS,
        data: hitResult,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Detect if an input is a hit or miss
   */
  private detectHit(input: InputEvent, timestamp: number): HitResult | null {
    if (!this.pattern || !this.pattern.notes || this.pattern.notes.length === 0) {
      return null;
    }
    
    // Find notes that match the input
    const matchingNotes = this.pattern.notes.filter((note, index) => {
      // Skip already processed notes
      if (this.processedNotes.has(index)) {
        return false;
      }
      
      // Check if the note matches the input value (e.g., MIDI note number)
      const matchesInput = note.midiNote === input.value || 
                           note.type === input.type;
      
      // Check if the note is within the hit window
      const timeWindow = this.missWindow;
      const timeDiff = Math.abs(note.time - timestamp);
      
      return matchesInput && timeDiff <= timeWindow;
    });
    
    if (matchingNotes.length === 0) {
      return null; // No matching notes
    }
    
    // Find the closest note in time
    let closestNote = matchingNotes[0];
    let closestTimeDelta = Math.abs(closestNote.time - timestamp);
    
    for (let i = 1; i < matchingNotes.length; i++) {
      const note = matchingNotes[i];
      const timeDelta = Math.abs(note.time - timestamp);
      
      if (timeDelta < closestTimeDelta) {
        closestNote = note;
        closestTimeDelta = timeDelta;
      }
    }
    
    // Calculate time delta (negative if early, positive if late)
    const timeDelta = timestamp - closestNote.time;
    
    // Determine accuracy based on timing
    const accuracy = this.calculateAccuracy(timeDelta);
    
    // Calculate points
    const points = this.calculatePoints(accuracy);
    
    // Mark the note as processed
    const noteIndex = this.pattern.notes.indexOf(closestNote);
    if (noteIndex !== -1) {
      this.processedNotes.add(noteIndex);
    }
    
    // Create hit result
    return {
      hit: accuracy !== HitAccuracy.MISS,
      accuracy,
      timeDelta,
      points,
      note: closestNote,
      timestamp,
      midiMessage: input.originalEvent as MIDIMessage,
      metadata: {}
    };
  }

  /**
   * Calculate the accuracy of a hit based on timing
   */
  private calculateAccuracy(timeDelta: number): HitAccuracy {
    const { perfectWindow, greatWindow, goodWindow, okayWindow } = this.options.scoringConfig;
    const absDelta = Math.abs(timeDelta);
    
    if (absDelta <= perfectWindow) {
      return HitAccuracy.PERFECT;
    } else if (absDelta <= greatWindow) {
      return HitAccuracy.GREAT;
    } else if (absDelta <= goodWindow) {
      return HitAccuracy.GOOD;
    } else if (absDelta <= okayWindow) {
      return HitAccuracy.OKAY;
    } else {
      return HitAccuracy.MISS;
    }
  }

  /**
   * Calculate points for a hit based on accuracy
   */
  private calculatePoints(accuracy: HitAccuracy): number {
    const { 
      perfectPoints, 
      greatPoints, 
      goodPoints, 
      okayPoints, 
      missPoints,
      multipliers 
    } = this.options.scoringConfig;
    
    let basePoints = 0;
    
    switch (accuracy) {
      case HitAccuracy.PERFECT:
        basePoints = perfectPoints;
        break;
      case HitAccuracy.GREAT:
        basePoints = greatPoints;
        break;
      case HitAccuracy.GOOD:
        basePoints = goodPoints;
        break;
      case HitAccuracy.OKAY:
        basePoints = okayPoints;
        break;
      case HitAccuracy.MISS:
        basePoints = missPoints;
        break;
    }
    
    // Apply multipliers
    let finalPoints = basePoints;
    
    if (multipliers) {
      // Apply combo multiplier if provided
      if (multipliers.combo && typeof multipliers.combo === 'function') {
        finalPoints *= multipliers.combo(this.stats.combo);
      }
      
      // Apply difficulty multiplier if provided
      if (multipliers.difficulty) {
        finalPoints *= multipliers.difficulty;
      }
    }
    
    return Math.round(finalPoints);
  }

  /**
   * Update game stats with a hit result
   */
  updateStats(hitResult: HitResult): void {
    // Update score
    this.stats.score += hitResult.points;
    
    // Update combo
    if (hitResult.hit) {
      this.stats.combo++;
      this.stats.notesHit++;
      
      // Update max combo
      if (this.stats.combo > this.stats.maxCombo) {
        this.stats.maxCombo = this.stats.combo;
      }
    } else {
      this.stats.combo = 0; // Reset combo on miss
    }
    
    // Update accuracy counts
    switch (hitResult.accuracy) {
      case HitAccuracy.PERFECT:
        this.stats.perfectCount++;
        break;
      case HitAccuracy.GREAT:
        this.stats.greatCount++;
        break;
      case HitAccuracy.GOOD:
        this.stats.goodCount++;
        break;
      case HitAccuracy.OKAY:
        this.stats.okayCount++;
        break;
      case HitAccuracy.MISS:
        this.stats.missCount++;
        break;
    }
    
    // Calculate overall accuracy
    if (this.stats.totalNotes > 0) {
      const weightedTotal = 
        this.stats.perfectCount * 1.0 +
        this.stats.greatCount * 0.9 +
        this.stats.goodCount * 0.7 +
        this.stats.okayCount * 0.5;
      
      const totalJudged = 
        this.stats.perfectCount +
        this.stats.greatCount +
        this.stats.goodCount +
        this.stats.okayCount +
        this.stats.missCount;
      
      this.stats.accuracy = (weightedTotal / totalJudged) * 100;
    }
    
    // Calculate progress
    if (this.pattern) {
      const totalProcessed = this.processedNotes.size;
      this.stats.progress = totalProcessed / this.stats.totalNotes;
    }
    
    // Emit stats updated event
    this.emitEvent({
      type: RhythmEngineEventType.STATS_UPDATED,
      data: this.stats,
      timestamp: Date.now()
    });
  }

  /**
   * Update the game state (called by the game loop)
   */
  private update(currentTime: number): void {
    if (this.state !== GameState.PLAYING || !this.pattern) {
      return;
    }
    
    // Skip if no time has passed
    if (this.lastUpdateTime === currentTime) {
      return;
    }
    
    // Handle missed notes if enabled
    if (this.options.autoHandleMisses) {
      this.handleMisses(currentTime);
    }
    
    // Check if the pattern is complete
    if (this.isPatternComplete()) {
      this.completePattern();
    }
    
    this.lastUpdateTime = currentTime;
  }

  /**
   * Handle missed notes
   */
  private handleMisses(currentTime: number): void {
    if (!this.pattern || !this.pattern.notes) {
      return;
    }
    
    // Apply latency offset
    const adjustedTime = currentTime - this.options.latencyOffset;
    
    // Find notes that should have been hit but weren't
    this.pattern.notes.forEach((note, index) => {
      // Skip already processed notes
      if (this.processedNotes.has(index)) {
        return;
      }
      
      // Check if the note is in the past beyond the miss window
      const missDeadline = note.time + this.missWindow;
      
      if (adjustedTime > missDeadline) {
        // Create a miss result
        const missResult: HitResult = {
          hit: false,
          accuracy: HitAccuracy.MISS,
          timeDelta: adjustedTime - note.time,
          points: this.options.scoringConfig.missPoints,
          note,
          timestamp: currentTime,
          metadata: {}
        };
        
        // Update stats with the miss
        this.updateStats(missResult);
        
        // Mark the note as processed
        this.processedNotes.add(index);
        
        // Emit miss event
        this.emitEvent({
          type: RhythmEngineEventType.MISS,
          data: missResult,
          timestamp: currentTime
        });
      }
    });
  }

  /**
   * Check if the pattern is complete
   */
  private isPatternComplete(): boolean {
    if (!this.pattern || !this.pattern.notes) {
      return false;
    }
    
    // Check if all notes have been processed
    return this.processedNotes.size === this.pattern.notes.length;
  }

  /**
   * Complete the pattern
   */
  private completePattern(): void {
    this.state = GameState.GAME_OVER;
    
    // Stop the game loop
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    
    // Emit pattern completed event
    this.emitEvent({
      type: RhythmEngineEventType.PATTERN_COMPLETED,
      data: {
        pattern: this.pattern,
        stats: this.stats
      },
      timestamp: Date.now()
    });
    
    // Emit game state changed event
    this.emitEvent({
      type: RhythmEngineEventType.GAME_STATE_CHANGED,
      data: this.state,
      timestamp: Date.now()
    });
  }

  /**
   * Add an event listener
   */
  addEventListener(type: RhythmEngineEventType | string, listener: EventListener): void {
    const eventType = type as RhythmEngineEventType;
    
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType)!.push(listener);
  }

  /**
   * Remove an event listener
   */
  removeEventListener(type: RhythmEngineEventType | string, listener: EventListener): void {
    const eventType = type as RhythmEngineEventType;
    
    if (this.listeners.has(eventType)) {
      const listeners = this.listeners.get(eventType)!;
      const index = listeners.indexOf(listener);
      
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * Emit an event to all listeners
   */
  private emitEvent(event: RhythmEngineEvent): void {
    if (this.listeners.has(event.type)) {
      const listeners = this.listeners.get(event.type)!;
      
      for (const listener of listeners) {
        try {
          listener(event);
        } catch (error) {
          console.error('Error in event listener:', error);
        }
      }
    }
  }

  /**
   * Get the current game state
   */
  getState(): GameState {
    return this.state;
  }

  /**
   * Get the current pattern
   */
  getPattern(): Pattern | null {
    return this.pattern;
  }

  /**
   * Get the current game stats
   */
  getStats(): GameStats {
    return { ...this.stats };
  }

  /**
   * Get the current engine options
   */
  getOptions(): Required<RhythmEngineOptions> {
    return { ...this.options };
  }

  /**
   * Dispose of the engine and clean up resources
   */
  dispose(): void {
    // Stop the game loop
    if (this.gameLoop) {
      this.gameLoop.stop();
    }
    
    // Clear all listeners
    this.listeners.clear();
  }
} 