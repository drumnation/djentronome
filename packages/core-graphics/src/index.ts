/**
 * Core Graphics Package
 * 
 * This package provides graphics rendering capabilities for the Djentronome project.
 */
import { RendererOptions, SpriteOptions, Vector2D } from './types';

/**
 * Main renderer class for handling canvas drawing
 */
export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private clearColor: string;

  /**
   * Create a new renderer
   * @param options Renderer options
   */
  constructor(options: RendererOptions) {
    this.width = options.width;
    this.height = options.height;
    this.clearColor = options.clearColor || '#000000';
    
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    
    // Get context
    const ctx = this.canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context');
    }
    this.ctx = ctx;
    
    // Append to target if provided
    if (options.target) {
      options.target.appendChild(this.canvas);
    }
  }
  
  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.fillStyle = this.clearColor;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  
  /**
   * Render a sprite to the canvas
   * @param sprite The sprite to render
   */
  renderSprite(sprite: Sprite): void {
    // Implementation would include loading and drawing the sprite's texture
    // This is a simplified placeholder
    this.ctx.fillStyle = '#FF0000'; // Placeholder for sprite texture
    this.ctx.fillRect(
      sprite.position.x, 
      sprite.position.y, 
      50 * (sprite.scale?.x || 1), 
      50 * (sprite.scale?.y || 1)
    );
  }
  
  /**
   * Resize the renderer
   * @param width New width
   * @param height New height
   */
  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
  }
}

/**
 * Sprite class for drawable game objects
 */
export class Sprite {
  texture: string;
  position: Vector2D;
  scale?: Vector2D;
  
  /**
   * Create a new sprite
   * @param options Sprite options
   */
  constructor(options: SpriteOptions) {
    this.texture = options.texture;
    this.position = options.position;
    this.scale = options.scale || { x: 1, y: 1 };
  }
}

// Export all types
export * from './types';
