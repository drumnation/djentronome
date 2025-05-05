import { describe, it, expect, vi } from 'vitest';
import { createGameStateMock, createInputHandlerMock, createRendererMock } from './index';

describe('Test Utilities Mocks', () => {
  it('should create a default game state mock', () => {
    const mockState = createGameStateMock();
    
    expect(mockState.player).toBeDefined();
    expect(mockState.player.health).toBe(100);
    expect(mockState.player.position).toEqual({ x: 0, y: 0 });
    expect(mockState.score).toBe(0);
    expect(mockState.level).toBe(1);
  });
  
  it('should override default values in game state mock', () => {
    const mockState = createGameStateMock({
      player: {
        health: 50,
        position: { x: 100, y: 200 }
      },
      score: 1000
    });
    
    expect(mockState.player.health).toBe(50);
    expect(mockState.player.position).toEqual({ x: 100, y: 200 });
    expect(mockState.score).toBe(1000);
    expect(mockState.level).toBe(1); // Default value not overridden
  });
  
  it('should create a default input handler mock', () => {
    const mockInput = createInputHandlerMock();
    
    expect(mockInput.keyPressed).toEqual({});
    expect(mockInput.registerCallback).toBeDefined();
    expect(typeof mockInput.registerCallback).toBe('function');
  });
  
  it('should override default values in input handler mock', () => {
    const mockInput = createInputHandlerMock({
      keyPressed: {
        ArrowLeft: true,
        ArrowRight: false
      }
    });
    
    expect(mockInput.keyPressed).toEqual({
      ArrowLeft: true,
      ArrowRight: false
    });
  });
  
  it('should create a renderer mock with all required methods', () => {
    const mockRenderer = createRendererMock();
    
    expect(mockRenderer.clear).toBeDefined();
    expect(mockRenderer.renderSprite).toBeDefined();
    expect(mockRenderer.resize).toBeDefined();
  });
}); 