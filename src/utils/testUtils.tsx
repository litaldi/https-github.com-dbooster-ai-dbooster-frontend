
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock performance APIs for testing
if (typeof window !== 'undefined') {
  // Mock Performance Observer
  if (!window.PerformanceObserver) {
    window.PerformanceObserver = class MockPerformanceObserver {
      observe() {}
      disconnect() {}
      takeRecords() { return []; }
    } as any;
  }

  // Mock ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = class MockResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }

  // Mock IntersectionObserver
  if (!window.IntersectionObserver) {
    window.IntersectionObserver = class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
      root = null;
      rootMargin = '';
      thresholds = [];
    } as any;
  }
}

interface AllTheProvidersProps {
  children: React.ReactNode;
}

const AllTheProviders: React.FC<AllTheProvidersProps> = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          {children}
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Accessibility testing helpers
export const axeMatchers = {
  toHaveNoViolations: expect.extend({
    toHaveNoViolations(received) {
      if (received.violations.length === 0) {
        return {
          pass: true,
          message: () => 'Expected element to have accessibility violations',
        };
      }
      
      const violationMessages = received.violations.map((violation: any) => 
        `${violation.id}: ${violation.description} (${violation.nodes.length} elements)`
      ).join('\n');

      return {
        pass: false,
        message: () => `Expected element to have no accessibility violations, but found:\n${violationMessages}`,
      };
    },
  }).toHaveNoViolations,
};

// Performance testing helpers
export const performanceHelpers = {
  measureRenderTime: async (renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    await new Promise(resolve => setTimeout(resolve, 0)); // Wait for render
    const end = performance.now();
    return end - start;
  },

  createMockPerformanceEntry: (name: string, duration: number) => ({
    name,
    entryType: 'measure',
    startTime: 0,
    duration,
    toJSON: () => ({ name, duration }),
  }),
};

// Custom test utilities
export const testUtils = {
  // Wait for element to be removed from DOM
  waitForElementToBeRemoved: async (element: Element) => {
    return new Promise<void>((resolve) => {
      const observer = new MutationObserver(() => {
        if (!document.contains(element)) {
          observer.disconnect();
          resolve();
        }
      });
      
      observer.observe(document, {
        childList: true,
        subtree: true,
      });
    });
  },

  // Simulate user typing with realistic delays
  simulateTyping: async (element: HTMLElement, text: string, delay = 50) => {
    const { fireEvent } = await import('@testing-library/react');
    
    for (let i = 0; i < text.length; i++) {
      const value = text.slice(0, i + 1);
      fireEvent.change(element, { target: { value } });
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  },

  // Create mock data generators
  createMockUser: (overrides = {}) => ({
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://example.com/avatar.jpg',
    role: 'user',
    createdAt: new Date().toISOString(),
    ...overrides,
  }),

  createMockRepository: (overrides = {}) => ({
    id: 'repo-1',
    name: 'example-repo',
    description: 'An example repository',
    url: 'https://github.com/example/repo',
    stars: 100,
    language: 'TypeScript',
    isPrivate: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  }),
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };
export { userEvent } from '@testing-library/user-event';
