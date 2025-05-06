import { vi } from 'vitest';

// Mock Renderer class
export const Renderer = vi.fn().mockImplementation(() => ({
  init: vi.fn(),
  clear: vi.fn(),
  render: vi.fn(),
  renderSprite: vi.fn(),
  renderText: vi.fn(),
  resize: vi.fn(),
  cleanup: vi.fn(),
}));

// Mock functions
export const createRenderer = vi.fn().mockImplementation(() => new Renderer());

// Default export
export default { Renderer, createRenderer }; 