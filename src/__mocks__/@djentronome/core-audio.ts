import { vi } from 'vitest';

// Mock AudioSystem class
export const AudioSystem = vi.fn().mockImplementation(() => ({
  init: vi.fn(),
  play: vi.fn(),
  stop: vi.fn(),
  pause: vi.fn(),
  resume: vi.fn(),
  setVolume: vi.fn(),
  loadSound: vi.fn().mockResolvedValue(true),
}));

// Mock functions
export const createAudioSystem = vi.fn().mockImplementation(() => new AudioSystem());

// Default export
export default { AudioSystem, createAudioSystem }; 