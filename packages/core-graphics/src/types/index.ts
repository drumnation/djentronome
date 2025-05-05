/**
 * Core types for graphics package
 */

/**
 * 2D Vector representation
 */
export interface Vector2D {
  x: number;
  y: number;
}

/**
 * Options for renderer initialization
 */
export interface RendererOptions {
  /** Width of the renderer in pixels */
  width: number;
  
  /** Height of the renderer in pixels */
  height: number;
  
  /** Element to append the canvas to */
  target?: HTMLElement;
  
  /** Background clear color (CSS color string) */
  clearColor?: string;
}

/**
 * Options for sprite creation
 */
export interface SpriteOptions {
  /** Path or identifier for the sprite texture */
  texture: string;
  
  /** Position of the sprite in 2D space */
  position: Vector2D;
  
  /** Optional scale of the sprite (default: { x: 1, y: 1 }) */
  scale?: Vector2D;
} 