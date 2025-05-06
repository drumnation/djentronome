/**
 * Time provider implementation
 */

import { TimeProvider } from './types';

/**
 * Options for the DefaultTimeProvider
 */
export interface TimeProviderOptions {
  /**
   * Initial time scale (default: 1.0)
   */
  timeScale?: number;
}

/**
 * Default implementation of the TimeProvider interface
 */
export class DefaultTimeProvider implements TimeProvider {
  private time: number = 0;
  private deltaTime: number = 0;
  private lastTimestamp: number = 0;
  private paused: boolean = false;
  private timeScale: number;
  private accumulatedTime: number = 0;
  private interpolationFactor: number = 0;

  /**
   * Create a new DefaultTimeProvider
   */
  constructor(options: TimeProviderOptions = {}) {
    this.timeScale = options.timeScale ?? 1.0;
    this.lastTimestamp = performance.now() / 1000;
  }

  /**
   * Update the time provider with the current timestamp
   * @param timestamp Current timestamp in milliseconds
   * @param fixedDeltaTime Fixed delta time for updates in seconds
   */
  update(timestamp: number, fixedDeltaTime: number): void {
    // Convert timestamp to seconds
    const currentTime = timestamp / 1000;
    
    // Calculate raw delta time
    this.deltaTime = (currentTime - this.lastTimestamp) * this.timeScale;
    
    // Update last timestamp
    this.lastTimestamp = currentTime;
    
    // If paused, don't advance time
    if (this.paused) {
      this.deltaTime = 0;
      this.interpolationFactor = 0;
      return;
    }
    
    // Accumulate time for fixed timestep
    this.accumulatedTime += this.deltaTime;
    
    // Calculate how many fixed steps to perform
    const fixedSteps = Math.floor(this.accumulatedTime / fixedDeltaTime);
    
    // Update game time based on fixed steps
    if (fixedSteps > 0) {
      this.time += fixedSteps * fixedDeltaTime;
      this.accumulatedTime -= fixedSteps * fixedDeltaTime;
    }
    
    // Calculate interpolation factor (alpha) for rendering
    this.interpolationFactor = this.accumulatedTime / fixedDeltaTime;
  }

  /**
   * Get the current game time in seconds
   */
  getTime(): number {
    return this.time;
  }

  /**
   * Get the delta time since the last frame in seconds
   */
  getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Get the interpolation factor for rendering (0-1)
   */
  getInterpolationFactor(): number {
    return this.interpolationFactor;
  }

  /**
   * Pause the time provider
   */
  pause(): void {
    this.paused = true;
  }

  /**
   * Resume the time provider
   */
  resume(): void {
    // Reset last timestamp to current time to avoid huge delta
    this.lastTimestamp = performance.now() / 1000;
    this.paused = false;
  }

  /**
   * Check if the time provider is paused
   */
  isPaused(): boolean {
    return this.paused;
  }

  /**
   * Set the time scale (e.g., slow motion, fast forward)
   * @param scale Time scale factor (1.0 = normal speed)
   */
  setTimeScale(scale: number): void {
    this.timeScale = Math.max(0, scale);
  }

  /**
   * Get the current time scale
   */
  getTimeScale(): number {
    return this.timeScale;
  }

  /**
   * Reset the time provider
   */
  reset(): void {
    this.time = 0;
    this.deltaTime = 0;
    this.lastTimestamp = performance.now() / 1000;
    this.accumulatedTime = 0;
    this.interpolationFactor = 0;
  }
} 