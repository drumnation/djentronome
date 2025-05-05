/**
 * Test utilities for Djentronome
 * @packageDocumentation
 */

/**
 * Test Utilities Package
 * 
 * This package provides testing utilities for the Djentronome project.
 */
import { vi } from 'vitest';
import { GameStateMockOptions, InputHandlerMockOptions, Vector2D } from './types';

/**
 * Create a mock game state for testing
 * @param options Optional configuration for the game state
 * @param initialState Optional initial state
 * @returns A mock game state object
 */
export function createGameStateMock(options?: GameStateMockOptions, initialState?: Record<string, any>) {
  const playerData = initialState && 'player' in initialState ? initialState['player'] : {};
  
  return {
    player: {
      health: options?.player?.health ?? 100,
      position: options?.player?.position ?? { x: 0, y: 0 },
      ...playerData
    },
    enemies: options?.enemies ?? [],
    score: options?.score ?? 0,
    level: options?.level ?? 1,
    ...initialState
  };
}

/**
 * Create a mock input handler for testing
 * @param options Options for the mock input handler
 * @returns A mock input handler object
 */
export function createInputHandlerMock(options?: InputHandlerMockOptions) {
  return {
    keyPressed: options?.keyPressed || {},
    registerCallback: vi.fn(),
    unregisterCallback: vi.fn(),
    enableKeyboard: vi.fn(),
    disableKeyboard: vi.fn(),
    update: vi.fn(),
    cleanup: vi.fn()
  };
}

/**
 * Create a mock renderer for testing
 * @returns A mock renderer object
 */
export function createRendererMock() {
  return {
    clear: vi.fn(),
    renderSprite: vi.fn(),
    resize: vi.fn()
  };
}

// Importing from vitest
import { expect } from 'vitest';

/**
 * Extend Vitest expect with custom matchers
 */
export function extendExpect() {
  expect.extend({
    toBeVector2D(received: Vector2D, expected: Vector2D) {
      const pass = received.x === expected.x && received.y === expected.y;
      return {
        pass,
        message: () => 
          `Expected ${JSON.stringify(received)} ${pass ? 'not ' : ''}to be vector ${JSON.stringify(expected)}`
      };
    },
    
    toBeRenderedAt(received: any, expected: Vector2D) {
      const position = received.position || {};
      const pass = position.x === expected.x && position.y === expected.y;
      return {
        pass,
        message: () => 
          `Expected object ${pass ? 'not ' : ''}to be rendered at position ${JSON.stringify(expected)}`
      };
    }
  });
}

// Export all types
export * from './types';
