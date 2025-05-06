import { vi, beforeEach } from 'vitest';

// Mock browser APIs if they're not available
if (typeof window === 'undefined') {
  global.window = {
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    document: {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    },
  } as any;
}

// Reset mocks before each test
beforeEach(() => {
  vi.resetAllMocks();
}); 