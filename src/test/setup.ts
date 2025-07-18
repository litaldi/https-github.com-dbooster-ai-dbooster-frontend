
import { beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// Global test setup
beforeAll(() => {
  // Mock window.location if needed
  Object.defineProperty(window, 'location', {
    value: {
      origin: 'http://localhost:3000',
      pathname: '/',
      search: '',
      hash: ''
    },
    writable: true
  });

  // Mock window.crypto for tests
  Object.defineProperty(window, 'crypto', {
    value: {
      randomUUID: () => 'test-uuid-' + Math.random().toString(36).substr(2, 9),
      subtle: {
        digest: vi.fn().mockResolvedValue(new ArrayBuffer(32))
      }
    }
  });

  // Mock navigator
  Object.defineProperty(window, 'navigator', {
    value: {
      userAgent: 'Mozilla/5.0 (Test Environment)',
      language: 'en-US',
      platform: 'TestOS',
      hardwareConcurrency: 4
    },
    writable: true
  });

  // Mock screen
  Object.defineProperty(window, 'screen', {
    value: {
      width: 1920,
      height: 1080
    }
  });

  // Mock performance if available
  if ('performance' in window) {
    (window.performance as any).memory = {
      usedJSHeapSize: 1000000,
      jsHeapSizeLimit: 10000000
    };
  }

  // Mock fetch globally
  global.fetch = vi.fn();
});

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Reset fetch mock to default success response
  vi.mocked(global.fetch).mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    status: 200,
    statusText: 'OK'
  } as any);
});

afterEach(() => {
  // Cleanup React testing utilities
  cleanup();
  
  // Clear all timers
  vi.clearAllTimers();
  
  // Reset modules if needed
  vi.resetModules();
});
