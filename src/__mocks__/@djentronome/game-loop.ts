import { vi } from 'vitest';

// Define properties and methods that GameLoop instances should have
const gameLoopMethods = {
  start: vi.fn(),
  stop: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  setUpdateFunction: vi.fn(),
  setRenderFunction: vi.fn(),
  getElapsedTime: vi.fn().mockReturnValue(0),
  getDeltaTime: vi.fn().mockReturnValue(16.67),
  getFrameCount: vi.fn().mockReturnValue(0),
};

// Create a constructor for GameLoop that returns an object with all methods mocked
class GameLoopClass {
  constructor() {
    return gameLoopMethods;
  }
}

// Export the class for instantiation via "new GameLoop()"
export default GameLoopClass;

// For modules that might import { createGameLoop } directly
export const createGameLoop = vi.fn().mockImplementation(() => ({ ...gameLoopMethods })); 