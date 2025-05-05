import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Renderer, Sprite } from '../../src';

// Mock DOM elements for browser-like environment
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn(),
    drawImage: vi.fn()
  }))
};

// Mock document methods
const mockAppendChild = vi.fn();

describe('Renderer-Sprite Integration', () => {
  beforeEach(() => {
    // Setup DOM mocks
    vi.spyOn(document, 'createElement').mockImplementation(() => mockCanvas as unknown as HTMLCanvasElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render multiple sprites correctly', () => {
    // Create renderer
    const renderer = new Renderer({ 
      width: 800, 
      height: 600,
      clearColor: '#000000'
    });
    
    // Create several sprites
    const sprites = [
      new Sprite({
        texture: 'sprite1.png',
        position: { x: 100, y: 100 },
        scale: { x: 1, y: 1 }
      }),
      new Sprite({
        texture: 'sprite2.png',
        position: { x: 200, y: 150 },
        scale: { x: 2, y: 2 }
      }),
      new Sprite({
        texture: 'sprite3.png',
        position: { x: 300, y: 200 },
        scale: { x: 0.5, y: 0.5 }
      })
    ];
    
    // Render all sprites
    renderer.clear();
    sprites.forEach(sprite => {
      renderer.renderSprite(sprite);
    });
    
    // Verify canvas operations were performed
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('should work with the DOM when a target is provided', () => {
    // Create a mock target element
    const mockTarget = {
      appendChild: mockAppendChild
    };
    
    // Create renderer with target
    const renderer = new Renderer({ 
      width: 800, 
      height: 600,
      target: mockTarget as unknown as HTMLElement
    });
    
    // Verify the canvas was appended to the target
    expect(mockAppendChild).toHaveBeenCalledWith(mockCanvas);
    
    // Create and render a sprite
    const sprite = new Sprite({
      texture: 'test.png',
      position: { x: 100, y: 100 }
    });
    
    renderer.renderSprite(sprite);
  });
}); 