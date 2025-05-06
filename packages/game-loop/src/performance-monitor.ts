/**
 * Performance monitoring utilities for the game loop
 */

/**
 * Performance statistics
 */
export interface PerformanceStats {
  /**
   * Current frames per second
   */
  fps: number;
  
  /**
   * Average frames per second over the sample window
   */
  avgFps: number;
  
  /**
   * Minimum frames per second over the sample window
   */
  minFps: number;
  
  /**
   * Maximum frames per second over the sample window
   */
  maxFps: number;
  
  /**
   * Current frame time in milliseconds
   */
  frameTime: number;
  
  /**
   * Average frame time in milliseconds over the sample window
   */
  avgFrameTime: number;
  
  /**
   * Minimum frame time in milliseconds over the sample window
   */
  minFrameTime: number;
  
  /**
   * Maximum frame time in milliseconds over the sample window
   */
  maxFrameTime: number;
  
  /**
   * Number of update calls in the last frame
   */
  updateCount: number;
  
  /**
   * Average update count over the sample window
   */
  avgUpdateCount: number;
}

/**
 * Performance monitor options
 */
export interface PerformanceMonitorOptions {
  /**
   * Number of frames to sample for statistics
   */
  sampleSize?: number;
  
  /**
   * Whether to enable verbose logging
   */
  verbose?: boolean;
}

/**
 * Performance monitor for tracking frame times and FPS
 */
export class PerformanceMonitor {
  private frameTimeHistory: number[] = [];
  private fpsHistory: number[] = [];
  private updateCountHistory: number[] = [];
  private lastFrameTime: number = 0;
  private sampleSize: number;
  private verbose: boolean;
  private currentUpdateCount: number = 0;
  
  /**
   * Create a new performance monitor
   */
  constructor(options: PerformanceMonitorOptions = {}) {
    this.sampleSize = options.sampleSize ?? 60;
    this.verbose = options.verbose ?? false;
  }
  
  /**
   * Begin a new frame
   * @param timestamp Current timestamp in milliseconds
   */
  beginFrame(timestamp: number): void {
    // Reset update count
    this.currentUpdateCount = 0;
    
    // First frame - just record timestamp and return
    if (this.lastFrameTime === 0) {
      this.lastFrameTime = timestamp;
      return;
    }
  }
  
  /**
   * Record an update call
   */
  recordUpdate(): void {
    this.currentUpdateCount++;
  }
  
  /**
   * End the current frame and calculate statistics
   * @param timestamp Current timestamp in milliseconds
   * @returns Current performance statistics
   */
  endFrame(timestamp: number): PerformanceStats {
    // Calculate frame time
    const frameTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    // Calculate FPS (avoid division by zero)
    const fps = frameTime > 0 ? 1000 / frameTime : 0;
    
    // Add to history, keeping only the latest sampleSize entries
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > this.sampleSize) {
      this.frameTimeHistory.shift();
    }
    
    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > this.sampleSize) {
      this.fpsHistory.shift();
    }
    
    this.updateCountHistory.push(this.currentUpdateCount);
    if (this.updateCountHistory.length > this.sampleSize) {
      this.updateCountHistory.shift();
    }
    
    // Calculate statistics
    const stats = this.calculateStats();
    
    // Log if verbose
    if (this.verbose) {
      console.log(`FPS: ${stats.fps.toFixed(2)} | Frame Time: ${stats.frameTime.toFixed(2)}ms | Updates: ${stats.updateCount}`);
    }
    
    return stats;
  }
  
  /**
   * Calculate statistics from the current history
   */
  private calculateStats(): PerformanceStats {
    // Handle empty history
    if (this.frameTimeHistory.length === 0) {
      return {
        fps: 0,
        avgFps: 0,
        minFps: 0,
        maxFps: 0,
        frameTime: 0,
        avgFrameTime: 0,
        minFrameTime: 0,
        maxFrameTime: 0,
        updateCount: 0,
        avgUpdateCount: 0
      };
    }
    
    // Calculate frame time statistics
    const frameTime = this.frameTimeHistory[this.frameTimeHistory.length - 1] || 0;
    const avgFrameTime = this.calculateAverage(this.frameTimeHistory);
    const minFrameTime = Math.min(...this.frameTimeHistory);
    const maxFrameTime = Math.max(...this.frameTimeHistory);
    
    // Calculate FPS statistics
    const fps = this.fpsHistory[this.fpsHistory.length - 1] || 0;
    const avgFps = this.calculateAverage(this.fpsHistory);
    const minFps = Math.min(...this.fpsHistory);
    const maxFps = Math.max(...this.fpsHistory);
    
    // Calculate update count statistics
    const updateCount = this.updateCountHistory[this.updateCountHistory.length - 1] || 0;
    const avgUpdateCount = this.calculateAverage(this.updateCountHistory);
    
    return {
      fps,
      avgFps,
      minFps,
      maxFps,
      frameTime,
      avgFrameTime,
      minFrameTime,
      maxFrameTime,
      updateCount,
      avgUpdateCount
    };
  }
  
  /**
   * Calculate the average of an array of numbers
   */
  private calculateAverage(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }
  
  /**
   * Reset the performance monitor
   */
  reset(): void {
    this.frameTimeHistory = [];
    this.fpsHistory = [];
    this.updateCountHistory = [];
    this.lastFrameTime = 0;
    this.currentUpdateCount = 0;
  }
} 