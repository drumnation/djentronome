/**
 * Enhanced game loop implementation with fixed timestep and event system
 */

import { DefaultTimeProvider } from './time-provider';
import { EventEmitter } from './event-emitter';
import { PerformanceMonitor, PerformanceStats } from './performance-monitor';
import { 
  GameLoopOptions,
  GameLoopEventType, 
  GameLoopEvent, 
  TimeProvider,
  FixedTimestepOptions
} from './types';

// Fallbacks for environments without requestAnimationFrame/cancelAnimationFrame
const requestAnimationFramePolyfill = (callback: FrameRequestCallback): number => {
  return setTimeout(() => callback(performance.now()), 16) as unknown as number;
};

const cancelAnimationFramePolyfill = (handle: number): void => {
  clearTimeout(handle);
};

// Use browser APIs if available, otherwise use polyfills
const RAF = typeof requestAnimationFrame !== 'undefined' 
  ? requestAnimationFrame 
  : requestAnimationFramePolyfill;
  
const CAF = typeof cancelAnimationFrame !== 'undefined' 
  ? cancelAnimationFrame 
  : cancelAnimationFramePolyfill;

// Export integrations
export { GameLoopPatternIntegration } from './integrations/pattern-player';
export type { GameLoopPatternIntegrationOptions } from './integrations/pattern-player';

export type { 
  GameLoopEvent,
  TimeProvider,
  FixedTimestepOptions,
  PerformanceStats
};

export {
  DefaultTimeProvider,
  EventEmitter,
  PerformanceMonitor,
  GameLoopEventType
};

/**
 * Enhanced GameLoop with fixed timestep and event system
 */
export class GameLoop {
  private timeProvider: TimeProvider;
  private eventEmitter: EventEmitter;
  private performanceMonitor: PerformanceMonitor;
  
  private fps: number;
  private fixedDeltaTime: number;
  private maxUpdatesPerFrame: number;
  private running: boolean = false;
  private animationFrameId: number | null = null;
  private accumulator: number = 0;
  
  private update: (deltaTime: number) => void;
  private render?: (deltaTime: number, interpolation: number) => void;

  /**
   * Create a new GameLoop
   */
  constructor(options: GameLoopOptions & FixedTimestepOptions = { update: () => {} }) {
    // Initialize time provider if not provided
    this.timeProvider = new DefaultTimeProvider();
    
    // Initialize event emitter
    this.eventEmitter = new EventEmitter();
    
    // Initialize performance monitor
    this.performanceMonitor = new PerformanceMonitor({
      verbose: false,
      sampleSize: 60
    });
    
    // Set up loop parameters
    this.fps = options.fps || 60;
    this.fixedDeltaTime = 1 / this.fps;
    this.maxUpdatesPerFrame = options.maxUpdatesPerFrame || 5;
    
    // Store callbacks
    this.update = options.update;
    this.render = options.render;
  }

  /**
   * Subscribe to game loop events
   */
  on(type: GameLoopEventType, handler: (event: GameLoopEvent) => void): () => void {
    return this.eventEmitter.on(type, handler);
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.performanceMonitor.reset();
    
    // Emit start event
    this.emitEvent(GameLoopEventType.START);
    
    // Start the loop
    this.animationFrameId = RAF(this.loop.bind(this));
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    if (!this.running || this.animationFrameId === null) {
      return;
    }

    this.running = false;
    CAF(this.animationFrameId);
    this.animationFrameId = null;
    
    // Emit stop event
    this.emitEvent(GameLoopEventType.STOP);
  }

  /**
   * Pause the game loop - maintains the loop but doesn't update
   */
  pause(): void {
    if (!this.running || this.timeProvider.isPaused()) {
      return;
    }
    
    this.timeProvider.pause();
    
    // Emit pause event
    this.emitEvent(GameLoopEventType.PAUSE);
  }

  /**
   * Resume the game loop
   */
  resume(): void {
    if (!this.running || !this.timeProvider.isPaused()) {
      return;
    }
    
    this.timeProvider.resume();
    
    // Emit resume event
    this.emitEvent(GameLoopEventType.RESUME);
  }

  /**
   * Check if the loop is currently running
   */
  isRunning(): boolean {
    return this.running;
  }

  /**
   * Get the current performance statistics
   */
  getPerformanceStats(): PerformanceStats {
    return this.performanceMonitor.endFrame(performance.now());
  }

  /**
   * Get the time provider
   */
  getTimeProvider(): TimeProvider {
    return this.timeProvider;
  }

  /**
   * Set the time provider
   */
  setTimeProvider(timeProvider: TimeProvider): void {
    this.timeProvider = timeProvider;
  }

  /**
   * Set the time scale (e.g., slow motion, fast forward)
   */
  setTimeScale(scale: number): void {
    this.timeProvider.setTimeScale(scale);
  }

  /**
   * Get the time scale
   */
  getTimeScale(): number {
    return this.timeProvider.getTimeScale();
  }

  /**
   * Main loop function with fixed timestep
   */
  private loop(timestamp: number): void {
    if (!this.running) {
      return;
    }

    // Begin performance monitoring
    this.performanceMonitor.beginFrame(timestamp);
    
    // Update time provider
    this.timeProvider.update(timestamp, this.fixedDeltaTime);
    
    // Get delta time from time provider
    const deltaTime = this.timeProvider.getDeltaTime();
    
    // If paused, just render and queue next frame
    if (this.timeProvider.isPaused()) {
      // Render if needed
      if (this.render) {
        this.render(0, this.timeProvider.getInterpolationFactor());
        
        // Emit render event
        this.emitEvent(GameLoopEventType.RENDER);
      }
      
      // Queue next frame
      this.animationFrameId = RAF(this.loop.bind(this));
      return;
    }
    
    // Accumulate time
    this.accumulator += deltaTime;
    
    // Perform fixed updates
    let updateCount = 0;
    
    // Fixed timestep logic with maximum updates to prevent spiral of death
    while (this.accumulator >= this.fixedDeltaTime && updateCount < this.maxUpdatesPerFrame) {
      try {
        // Update game state
        this.update(this.fixedDeltaTime);
        
        // Emit update event
        this.emitEvent(GameLoopEventType.UPDATE);
        
        // Record update for performance monitoring
        this.performanceMonitor.recordUpdate();
        
        // Reduce accumulator
        this.accumulator -= this.fixedDeltaTime;
        
        // Increment update count
        updateCount++;
      } catch (error) {
        console.error('Error in game update:', error);
        
        // Emit error event
        this.emitEvent(GameLoopEventType.ERROR, { error });
        
        // Stop accumulating updates for this frame to prevent more errors
        break;
      }
    }
    
    // Calculate interpolation factor for smooth rendering
    const interpolation = this.timeProvider.getInterpolationFactor();
    
    // Render if needed
    if (this.render) {
      try {
        this.render(deltaTime, interpolation);
        
        // Emit render event
        this.emitEvent(GameLoopEventType.RENDER);
      } catch (error) {
        console.error('Error in game render:', error);
        
        // Emit error event
        this.emitEvent(GameLoopEventType.ERROR, { error });
      }
    }
    
    // Queue next frame
    this.animationFrameId = RAF(this.loop.bind(this));
  }
  
  /**
   * Emit a game loop event
   */
  private emitEvent(type: GameLoopEventType, data?: any): void {
    const event: GameLoopEvent = {
      type,
      time: this.timeProvider.getTime(),
      deltaTime: this.timeProvider.getDeltaTime(),
      data
    };
    
    this.eventEmitter.emit(event);
  }
}

export default GameLoop; 