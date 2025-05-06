import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    deps: {
      inline: [
        /@djentronome\/.*/, // Handle local packages
      ],
    },
    testTimeout: 10000, // Increase timeout to avoid test timeouts
  },
}); 