/**
 * GameLoop + PatternPlayer Integration
 * 
 * Provides a clean integration between the GameLoop and PatternPlayer.
 * This module ensures that pattern playback is properly synchronized with game time.
 */

import { GameLoop } from '../index';
import { GameLoopEventType } from '../types';
import { PatternPlayer, PatternPlayerEventType } from '@djentronome/pattern-loader';
import type { Pattern, PatternPlayerEvent, PatternPlayerOptions } from '@djentronome/pattern-loader';

/**
 * Options for the pattern player integration
 */
export interface GameLoopPatternIntegrationOptions {
  /**
   * Whether to automatically start pattern playback when the game loop starts
   */
  autoStartWithLoop?: boolean;

  /**
   * Whether to automatically pause pattern playback when the game loop pauses
   */
  autoPauseWithLoop?: boolean;

  /**
   * Whether to automatically resume pattern playback when the game loop resumes
   */
  autoResumeWithLoop?: boolean;

  /**
   * Whether to automatically stop pattern playback when the game loop stops
   */
  autoStopWithLoop?: boolean;

  /**
   * Look ahead time in milliseconds for scheduling notes
   */
  lookAheadTime?: number;

  /**
   * Buffer time in milliseconds to trigger notes slightly early
   */
  triggerBuffer?: number;
}

/**
 * Default options for the pattern player integration
 */
const DEFAULT_OPTIONS: Required<GameLoopPatternIntegrationOptions> = {
  autoStartWithLoop: true,
  autoPauseWithLoop: true,
  autoResumeWithLoop: true,
  autoStopWithLoop: true,
  lookAheadTime: 500,
  triggerBuffer: 10
};

/**
 * Class that integrates PatternPlayer with GameLoop for synchronized pattern playback
 */
export class GameLoopPatternIntegration {
  private gameLoop: GameLoop;
  private patternPlayer: PatternPlayer;
  private options: Required<GameLoopPatternIntegrationOptions>;
  private loopEventUnsubscribers: Array<() => void> = [];
  private initialized: boolean = false;
  private patternPlayerOptions: PatternPlayerOptions = {};

  /**
   * Create a new GameLoopPatternIntegration
   * 
   * @param gameLoop - The GameLoop instance to integrate with
   * @param patternPlayer - The PatternPlayer instance to use
   * @param options - Integration options
   */
  constructor(
    gameLoop: GameLoop, 
    patternPlayer: PatternPlayer, 
    options: GameLoopPatternIntegrationOptions = {}
  ) {
    this.gameLoop = gameLoop;
    this.patternPlayer = patternPlayer;
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  /**
   * Initialize the integration by setting up event listeners
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }

    // Set up pattern player with appropriate options
    this.configurePatternPlayer();

    // Set up game loop event listeners
    this.setupGameLoopEvents();

    // Set update function to link pattern player to game loop timing
    this.loopEventUnsubscribers.push(
      this.gameLoop.on(GameLoopEventType.UPDATE, (_event) => {
        this.patternPlayer.update(this.gameLoop.getTimeProvider().getTime());
      })
    );

    this.initialized = true;
  }

  /**
   * Configure the pattern player with appropriate options
   */
  private configurePatternPlayer(): void {
    // Store options to use when loading patterns
    this.patternPlayerOptions = {
      ...this.patternPlayerOptions,
      lookAheadTime: this.options.lookAheadTime,
      triggerBuffer: this.options.triggerBuffer
    };
  }

  /**
   * Set up event listeners for the game loop
   */
  private setupGameLoopEvents(): void {
    // Handle game loop start
    if (this.options.autoStartWithLoop) {
      this.loopEventUnsubscribers.push(
        this.gameLoop.on(GameLoopEventType.START, () => {
          this.patternPlayer.start();
        })
      );
    }

    // Handle game loop pause
    if (this.options.autoPauseWithLoop) {
      this.loopEventUnsubscribers.push(
        this.gameLoop.on(GameLoopEventType.PAUSE, () => {
          this.patternPlayer.pause();
        })
      );
    }

    // Handle game loop resume
    if (this.options.autoResumeWithLoop) {
      this.loopEventUnsubscribers.push(
        this.gameLoop.on(GameLoopEventType.RESUME, () => {
          this.patternPlayer.resume();
        })
      );
    }

    // Handle game loop stop
    if (this.options.autoStopWithLoop) {
      this.loopEventUnsubscribers.push(
        this.gameLoop.on(GameLoopEventType.STOP, () => {
          this.patternPlayer.stop();
        })
      );
    }
  }

  /**
   * Load a pattern from a file path
   * 
   * @param path - Path to the pattern file
   * @returns Promise that resolves when the pattern is loaded
   */
  async loadPatternFromPath(path: string): Promise<Pattern> {
    return this.patternPlayer.loadPatternFromPath(path);
  }

  /**
   * Load a pattern directly
   * 
   * @param pattern - Pattern to load
   */
  loadPattern(pattern: Pattern): void {
    this.patternPlayer.loadPattern(pattern);
  }

  /**
   * Set a callback for when a note is triggered
   * 
   * @param callback - Function to call when a note is triggered
   */
  onNoteTrigger(callback: (note: any) => void): void {
    this.patternPlayer.addEventListener(PatternPlayerEventType.NOTE_TRIGGERED, (event: PatternPlayerEvent) => {
      callback(event.data.note);
    });
  }

  /**
   * Set a callback for when the pattern section changes
   * 
   * @param callback - Function to call when the section changes
   */
  onSectionChange(callback: (section: any) => void): void {
    this.patternPlayer.addEventListener(PatternPlayerEventType.SECTION_CHANGED, (event: PatternPlayerEvent) => {
      callback(event.data.section);
    });
  }

  /**
   * Set a callback for pattern completion
   * 
   * @param callback - Function to call when the pattern completes
   */
  onPatternComplete(callback: () => void): void {
    this.patternPlayer.addEventListener(PatternPlayerEventType.COMPLETED, () => {
      callback();
    });
  }

  /**
   * Clean up event listeners
   */
  cleanup(): void {
    // Unsubscribe from game loop events
    this.loopEventUnsubscribers.forEach(unsubscribe => unsubscribe());
    this.loopEventUnsubscribers = [];
    this.initialized = false;
  }

  /**
   * Get the pattern player instance
   */
  getPatternPlayer(): PatternPlayer {
    return this.patternPlayer;
  }

  /**
   * Set the look ahead time for the pattern player
   * 
   * @param lookAheadTime - Look ahead time in milliseconds
   */
  setLookAheadTime(lookAheadTime: number): void {
    this.options.lookAheadTime = lookAheadTime;
    this.patternPlayerOptions.lookAheadTime = lookAheadTime;
  }

  /**
   * Set the trigger buffer for the pattern player
   * 
   * @param triggerBuffer - Trigger buffer in milliseconds
   */
  setTriggerBuffer(triggerBuffer: number): void {
    this.options.triggerBuffer = triggerBuffer;
    this.patternPlayerOptions.triggerBuffer = triggerBuffer;
  }
}