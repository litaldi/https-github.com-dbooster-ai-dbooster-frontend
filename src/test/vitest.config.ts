
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./setup.ts'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, '../'),
    },
  },
});
