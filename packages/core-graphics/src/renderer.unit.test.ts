import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Renderer, Sprite } from './index';

// Mock document createElement
const mockCanvas = {
  width: 0,
  height: 0,
  getContext: vi.fn(() => ({
    fillStyle: '',
    fillRect: vi.fn()
  }))
};

const mockAppendChild = vi.fn();

describe('Renderer', () => {
  beforeEach(() => {
    // Setup DOM mocks
    vi.spyOn(document, 'createElement').mockImplementation(() => mockCanvas as unknown as HTMLCanvasElement);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be defined', () => {
    const renderer = new Renderer({ width: 800, height: 600 });
    expect(renderer).toBeDefined();
  });

  it('should set canvas dimensions correctly', () => {
    const width = 800;
    const height = 600;
    new Renderer({ width, height });
    
    expect(mockCanvas.width).toBe(width);
    expect(mockCanvas.height).toBe(height);
  });

  it('should append canvas to target element when provided', () => {
    const target = { appendChild: mockAppendChild };
    new Renderer({ 
      width: 800, 
      height: 600, 
      target: target as unknown as HTMLElement 
    });
    
    expect(mockAppendChild).toHaveBeenCalledWith(mockCanvas);
  });

  it('should have working clear method', () => {
    const renderer = new Renderer({ width: 800, height: 600 });
    renderer.clear();
    
    // Context methods should be called with appropriate arguments
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });

  it('should have working renderSprite method', () => {
    const renderer = new Renderer({ width: 800, height: 600 });
    const sprite = new Sprite({
      texture: 'test.png',
      position: { x: 100, y: 100 }
    });
    
    renderer.renderSprite(sprite);
    
    // Context methods should be called for rendering
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
  });
}); 