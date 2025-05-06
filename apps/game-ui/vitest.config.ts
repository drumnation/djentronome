import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.ts'],
    testTimeout: 10000, // Increase timeout to avoid test timeouts
    deps: {
      optimizer: {
        web: {
          include: ['@djentronome/*'] // Include all local packages
        }
      }
    }
  },
}); 