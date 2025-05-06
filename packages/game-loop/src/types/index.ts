/**
 * Game Loop types
 */

/**
 * Game loop options
 */
export interface GameLoopOptions {
  /**
   * Target frames per second
   */
  fps?: number;
  /**
   * Function to call on each update frame
   */
  update: (deltaTime: number) => void;
  /**
   * Function to call on each render frame
   */
  render?: (deltaTime: number, interpolation: number) => void;
}

/**
 * Time provider interface
 */
export interface TimeProvider {
  /**
   * Get the current game time in seconds
   */
  getTime(): number;
  
  /**
   * Get the delta time since the last frame in seconds
   */
  getDeltaTime(): number;
  
  /**
   * Get the interpolation factor for rendering (0-1)
   */
  getInterpolationFactor(): number;
  
  /**
   * Pause the time provider
   */
  pause(): void;
  
  /**
   * Resume the time provider
   */
  resume(): void;
  
  /**
   * Check if the time provider is paused
   */
  isPaused(): boolean;
  
  /**
   * Set the time scale (e.g., slow motion, fast forward)
   */
  setTimeScale(scale: number): void;
  
  /**
   * Get the current time scale
   */
  getTimeScale(): number;
  
  /**
   * Update the time provider with the current timestamp
   * @param timestamp Current timestamp in milliseconds
   * @param fixedDeltaTime Fixed delta time for updates in seconds
   */
  update(timestamp: number, fixedDeltaTime: number): void;
}

/**
 * Game loop event types
 */
export enum GameLoopEventType {
  START = 'start',
  STOP = 'stop',
  PAUSE = 'pause',
  RESUME = 'resume',
  UPDATE = 'update',
  RENDER = 'render',
  ERROR = 'error'
}

/**
 * Game loop event handler
 */
export type GameLoopEventHandler = (event: GameLoopEvent) => void;

/**
 * Game loop event
 */
export interface GameLoopEvent {
  type: GameLoopEventType;
  time: number;
  deltaTime: number;
  data?: any;
}

/**
 * Fixed timestep options
 */
export interface FixedTimestepOptions {
  /**
   * Maximum number of updates to perform in a single frame
   * to prevent spiral of death
   */
  maxUpdatesPerFrame?: number;
} 