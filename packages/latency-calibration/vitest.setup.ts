import { expect, vi } from 'vitest';

// Setup global mocks for browser APIs
global.AudioContext = vi.fn().mockImplementation(() => ({
  currentTime: 0,
  createOscillator: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 0 }
  })),
  createGain: vi.fn().mockImplementation(() => ({
    connect: vi.fn(),
    gain: { value: 0 }
  })),
  destination: {}
}));

// Add custom matchers if needed
expect.extend({
  // Add custom matchers here if needed
}); 