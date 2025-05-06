import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Mock matchMedia for Mantine UI
window.matchMedia = vi.fn().mockImplementation(query => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

// Mock AudioContext
class MockAudioContext {
  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        value: 1.0,
        setValueAtTime: vi.fn(),
      },
    };
  }
  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: {
        setValueAtTime: vi.fn(),
      },
      type: 'sine',
    };
  }
}

global.AudioContext = MockAudioContext as any;
global.webkitAudioContext = MockAudioContext as any;

// Mock other DOM properties as needed
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
});

// Mock modules
vi.mock('@djentronome/game-loop');
vi.mock('@djentronome/input');
vi.mock('@djentronome/core-audio');
vi.mock('@djentronome/core-graphics'); 