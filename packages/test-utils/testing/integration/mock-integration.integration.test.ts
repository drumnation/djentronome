import { describe, it, expect, vi } from 'vitest';
import { 
  createGameStateMock, 
  createInputHandlerMock,
  createRendererMock,
  extendExpect
} from '../../src';

// Sample "real" classes to test the mocks' integration
class PlayerController {
  constructor(private gameState: any, private inputHandler: any) {}
  
  update(deltaTime: number) {
    // Apply movement based on input
    if (this.inputHandler.keyPressed['ArrowLeft']) {
      this.gameState.player.position.x -= 5 * (deltaTime / 16);
    }
    if (this.inputHandler.keyPressed['ArrowRight']) {
      this.gameState.player.position.x += 5 * (deltaTime / 16);
    }
  }
  
  render(renderer: any) {
    renderer.renderSprite({
      type: 'player',
      position: this.gameState.player.position
    });
  }
}

describe('Test Utilities Integration', () => {
  // Setup custom matchers
  beforeAll(() => {
    extendExpect();
  });
  
  it('should work together in a gameplay scenario', () => {
    // Arrange
    const mockGameState = createGameStateMock({
      player: {
        position: { x: 100, y: 100 }
      }
    });
    
    const mockInputHandler = createInputHandlerMock({
      keyPressed: {
        ArrowLeft: true
      }
    });
    
    const mockRenderer = createRendererMock();
    
    const playerController = new PlayerController(mockGameState, mockInputHandler);
    
    // Act - simulate update and render cycle
    playerController.update(16); // One frame at 60 FPS
    playerController.render(mockRenderer);
    
    // Assert
    expect(mockGameState.player.position.x).toBe(95); // Moved left 5 units
    expect(mockRenderer.renderSprite).toHaveBeenCalled();
    
    // Use custom matcher
    expect(mockGameState.player.position).toBeVector2D({ x: 95, y: 100 });
  });
}); 