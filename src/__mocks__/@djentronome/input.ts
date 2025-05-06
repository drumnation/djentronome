import { vi } from 'vitest';

// Mock InputHandler class
export const InputHandler = vi.fn().mockImplementation(() => ({
  init: vi.fn(),
  update: vi.fn(),
  cleanup: vi.fn(),
  isKeyPressed: vi.fn().mockReturnValue(false),
  isKeyDown: vi.fn().mockReturnValue(false),
  isKeyUp: vi.fn().mockReturnValue(true),
  addInputListener: vi.fn(),
  removeInputListener: vi.fn(),
  keyPressed: {},
}));

// Mock functions
export const createInputHandler = vi.fn().mockImplementation(() => new InputHandler());

// Default export (if any)
export default { InputHandler, createInputHandler }; 