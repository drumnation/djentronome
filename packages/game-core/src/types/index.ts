/**
 * Game Core Types for Djentronome
 */

/**
 * Game configuration
 */
export interface GameConfig {
  /** Width of the game canvas */
  width: number;
  
  /** Height of the game canvas */
  height: number;
  
  /** DOM element ID to attach the game to */
  containerId?: string;
  
  /** Default background color */
  backgroundColor?: string;
  
  /** Target frames per second */
  targetFps?: number;
  
  /** Whether to pause the game when the tab/window loses focus */
  pauseOnBlur?: boolean;
  
  /** Debug options */
  debug?: GameDebugOptions;
}

/**
 * Debug configuration
 */
export interface GameDebugOptions {
  /** Whether to enable debug mode */
  enabled: boolean;
  
  /** Whether to show FPS counter */
  showFps?: boolean;
  
  /** Whether to show collision boxes */
  showColliders?: boolean;
  
  /** Whether to log debug information to console */
  logToConsole?: boolean;
}

/**
 * Game state
 */
export interface GameState {
  /** Whether the game is running */
  running: boolean;
  
  /** Whether the game is paused */
  paused: boolean;
  
  /** Current frames per second */
  fps: number;
  
  /** Width of the game canvas */
  width: number;
  
  /** Height of the game canvas */
  height: number;
  
  /** Current game time in milliseconds */
  time: number;
}

/**
 * Game scene
 */
export interface GameScene {
  /** Scene identifier */
  id: string;
  
  /** Initialize the scene */
  init: () => void | Promise<void>;
  
  /** Update the scene */
  update: (dt: number) => void;
  
  /** Render the scene */
  render: () => void;
  
  /** Cleanup when leaving the scene */
  cleanup: () => void;
}

/**
 * Game lifecycle hooks
 */
export interface GameHooks {
  /** Called before the game starts */
  onBeforeStart?: () => void;
  
  /** Called after the game starts */
  onAfterStart?: () => void;
  
  /** Called when the game pauses */
  onPause?: () => void;
  
  /** Called when the game resumes */
  onResume?: () => void;
  
  /** Called before the game stops */
  onBeforeStop?: () => void;
  
  /** Called after the game stops */
  onAfterStop?: () => void;
} 