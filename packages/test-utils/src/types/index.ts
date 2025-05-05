/**
 * Types for test utilities
 * @packageDocumentation
 */

/**
 * Vector2D represents a 2D position or vector
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Options for creating a mock input handler
 */
export interface InputHandlerMockOptions {
  keyPressed?: Record<string, boolean>;
}

/**
 * Options for creating a mock game state
 */
export interface GameStateMockOptions {
  player?: {
    health?: number;
    position?: Vector2D;
    [key: string]: any;
  };
  enemies?: any[];
  score?: number;
  level?: number;
  [key: string]: any;
} 