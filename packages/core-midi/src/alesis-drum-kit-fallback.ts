import { ALESIS_NITRO_KICK_NOTE, ALESIS_NITRO_SNARE_NOTE, DrumHitCallback, DrumHitEvent } from './alesis-drum-kit';

/**
 * Key codes for fallback keyboard controls
 */
export enum FallbackKeys {
  // Keyboard codes for kick and snare
  KICK = 'KeyD',
  SNARE = 'KeyF',
  
  // Additional keys for future expansion
  HIHAT = 'KeyJ',
  TOM1 = 'KeyK',
  TOM2 = 'KeyL'
}

/**
 * Options for the fallback controller
 */
export interface DrumKitFallbackOptions {
  /**
   * Whether to enable the fallback mechanism
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Target element to attach keyboard listeners to
   * @default window
   */
  target?: HTMLElement | Window;
  
  /**
   * Velocity to use for fallback hits (0-127)
   * @default 100
   */
  defaultVelocity?: number;
  
  /**
   * Key mapping overrides
   */
  keyMapping?: Partial<Record<FallbackKeys, string>>;
}

/**
 * Default options for the fallback controller
 */
const DEFAULT_OPTIONS: DrumKitFallbackOptions = {
  enabled: true,
  target: typeof window !== 'undefined' ? window : undefined,
  defaultVelocity: 100
};

/**
 * Fallback controller for using keyboard to simulate Alesis Nitro drum kit
 * This is useful for testing without physical hardware
 */
export class AlesisDrumKitFallback {
  private options: DrumKitFallbackOptions;
  private isInitialized = false;
  private kickCallbacks: Set<DrumHitCallback> = new Set();
  private snareCallbacks: Set<DrumHitCallback> = new Set();
  private boundKeyDownHandler: (event: KeyboardEvent) => void;
  
  /**
   * Create a new fallback controller
   */
  constructor(options: DrumKitFallbackOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    // Bind the handler once to ensure we can remove it later
    this.boundKeyDownHandler = this.handleKeyDown.bind(this);
  }
  
  /**
   * Initialize the fallback controller
   */
  initialize(): void {
    if (this.isInitialized || !this.options.enabled || !this.options.target) {
      return;
    }
    
    // Attach keyboard event listener
    this.options.target.addEventListener('keydown', this.boundKeyDownHandler as EventListenerOrEventListenerObject);
    
    this.isInitialized = true;
  }
  
  /**
   * Handle keyboard events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    // Ignore if already handled or is a repeat
    if (event.defaultPrevented || event.repeat) {
      return;
    }
    
    // Get the key code (use mapping if provided)
    const keyCode = event.code;
    const keyMapping = this.options.keyMapping || {};
    
    // Generate hit event with current timestamp
    const hitEvent: DrumHitEvent = {
      timestamp: performance.now(),
      velocity: this.options.defaultVelocity || 100
    };
    
    // Check for kick drum key
    if (keyCode === (keyMapping[FallbackKeys.KICK] || FallbackKeys.KICK)) {
      // Trigger all kick callbacks
      this.kickCallbacks.forEach(callback => callback(hitEvent));
      
      // Prevent default to avoid scrolling, etc.
      event.preventDefault();
    }
    // Check for snare drum key
    else if (keyCode === (keyMapping[FallbackKeys.SNARE] || FallbackKeys.SNARE)) {
      // Trigger all snare callbacks
      this.snareCallbacks.forEach(callback => callback(hitEvent));
      
      // Prevent default to avoid scrolling, etc.
      event.preventDefault();
    }
  }
  
  /**
   * Register a callback for kick drum hits
   */
  onKickHit(callback: DrumHitCallback): void {
    this.kickCallbacks.add(callback);
  }
  
  /**
   * Unregister a callback for kick drum hits
   */
  offKickHit(callback: DrumHitCallback): void {
    this.kickCallbacks.delete(callback);
  }
  
  /**
   * Register a callback for snare drum hits
   */
  onSnareHit(callback: DrumHitCallback): void {
    this.snareCallbacks.add(callback);
  }
  
  /**
   * Unregister a callback for snare drum hits
   */
  offSnareHit(callback: DrumHitCallback): void {
    this.snareCallbacks.delete(callback);
  }
  
  /**
   * Manually trigger a kick drum hit
   * Useful for testing or UI button integration
   */
  triggerKickHit(velocity: number = this.options.defaultVelocity || 100): void {
    const hitEvent: DrumHitEvent = {
      timestamp: performance.now(),
      velocity
    };
    
    this.kickCallbacks.forEach(callback => callback(hitEvent));
  }
  
  /**
   * Manually trigger a snare drum hit
   * Useful for testing or UI button integration
   */
  triggerSnareHit(velocity: number = this.options.defaultVelocity || 100): void {
    const hitEvent: DrumHitEvent = {
      timestamp: performance.now(),
      velocity
    };
    
    this.snareCallbacks.forEach(callback => callback(hitEvent));
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    if (this.options.target && this.isInitialized) {
      this.options.target.removeEventListener('keydown', this.boundKeyDownHandler as EventListenerOrEventListenerObject);
    }
    
    this.kickCallbacks.clear();
    this.snareCallbacks.clear();
    this.isInitialized = false;
  }
  
  /**
   * Get MIDI note number for kick drum
   * @returns Kick drum MIDI note number
   */
  static get KICK_NOTE(): number {
    return ALESIS_NITRO_KICK_NOTE;
  }
  
  /**
   * Get MIDI note number for snare drum
   * @returns Snare drum MIDI note number
   */
  static get SNARE_NOTE(): number {
    return ALESIS_NITRO_SNARE_NOTE;
  }
} 