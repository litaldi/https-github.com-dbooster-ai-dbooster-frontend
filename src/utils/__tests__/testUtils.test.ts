
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { performanceHelpers, testUtils } from '../testUtils';

describe('testUtils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('performanceHelpers', () => {
    describe('measureRenderTime', () => {
      it('should measure render time', async () => {
        const mockRenderFunction = vi.fn();
        const startTime = performance.now();
        
        const renderTime = await performanceHelpers.measureRenderTime(mockRenderFunction);
        
        expect(mockRenderFunction).toHaveBeenCalled();
        expect(renderTime).toBeGreaterThanOrEqual(0);
        expect(renderTime).toBeLessThan(1000); // Should be very fast
      });

      it('should handle async render functions', async () => {
        const asyncRenderFunction = vi.fn().mockImplementation(async () => {
          await new Promise(resolve => setTimeout(resolve, 10));
        });
        
        const renderTime = await performanceHelpers.measureRenderTime(asyncRenderFunction);
        
        expect(asyncRenderFunction).toHaveBeenCalled();
        expect(renderTime).toBeGreaterThan(0);
      });
    });

    describe('createMockPerformanceEntry', () => {
      it('should create a valid performance entry', () => {
        const entry = performanceHelpers.createMockPerformanceEntry('test-measure', 100);
        
        expect(entry.name).toBe('test-measure');
        expect(entry.duration).toBe(100);
        expect(entry.entryType).toBe('measure');
        expect(entry.startTime).toBe(0);
        expect(typeof entry.toJSON).toBe('function');
      });

      it('should return proper JSON representation', () => {
        const entry = performanceHelpers.createMockPerformanceEntry('test', 50);
        const json = entry.toJSON();
        
        expect(json).toEqual({
          name: 'test',
          duration: 50
        });
      });
    });
  });

  describe('testUtils', () => {
    describe('simulateTyping', () => {
      it('should simulate typing with delays', async () => {
        // Create a mock input element
        const mockElement = document.createElement('input');
        document.body.appendChild(mockElement);
        
        const text = 'hello';
        await testUtils.simulateTyping(mockElement, text, 1); // 1ms delay for fast test
        
        expect(mockElement.value).toBe(text);
        
        document.body.removeChild(mockElement);
      }, 10000); // Increase timeout for this test
    });

    describe('createMockUser', () => {
      it('should create a user with default values', () => {
        const user = testUtils.createMockUser();
        
        expect(user).toEqual({
          id: 'user-1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: 'https://example.com/avatar.jpg',
          role: 'user',
          createdAt: expect.any(String)
        });
      });

      it('should allow overriding default values', () => {
        const customUser = testUtils.createMockUser({
          name: 'Jane Smith',
          role: 'admin'
        });
        
        expect(customUser.name).toBe('Jane Smith');
        expect(customUser.role).toBe('admin');
        expect(customUser.email).toBe('john@example.com'); // Default value
      });
    });

    describe('createMockRepository', () => {
      it('should create a repository with default values', () => {
        const repo = testUtils.createMockRepository();
        
        expect(repo).toEqual({
          id: 'repo-1',
          name: 'example-repo',
          description: 'An example repository',
          url: 'https://github.com/example/repo',
          stars: 100,
          language: 'TypeScript',
          isPrivate: false,
          createdAt: expect.any(String)
        });
      });

      it('should allow overriding default values', () => {
        const customRepo = testUtils.createMockRepository({
          name: 'my-custom-repo',
          language: 'JavaScript',
          isPrivate: true
        });
        
        expect(customRepo.name).toBe('my-custom-repo');
        expect(customRepo.language).toBe('JavaScript');
        expect(customRepo.isPrivate).toBe(true);
        expect(customRepo.stars).toBe(100); // Default value
      });
    });
  });

  describe('DOM manipulation utilities', () => {
    describe('waitForElementToBeRemoved', () => {
      it('should wait for element removal', async () => {
        const element = document.createElement('div');
        document.body.appendChild(element);
        
        // Remove element after a short delay
        setTimeout(() => {
          document.body.removeChild(element);
        }, 50);
        
        await testUtils.waitForElementToBeRemoved(element);
        
        expect(document.body.contains(element)).toBe(false);
      });

      it('should resolve immediately if element is already removed', async () => {
        const element = document.createElement('div');
        // Don't append to DOM
        
        const startTime = Date.now();
        await testUtils.waitForElementToBeRemoved(element);
        const endTime = Date.now();
        
        // Should resolve quickly since element was never in DOM
        expect(endTime - startTime).toBeLessThan(100);
      });
    });
  });
});
