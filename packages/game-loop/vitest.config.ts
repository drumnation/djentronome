import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.integration.test.ts'],
    deps: {
      inline: [/pattern-loader/],
    }
  },
}); 