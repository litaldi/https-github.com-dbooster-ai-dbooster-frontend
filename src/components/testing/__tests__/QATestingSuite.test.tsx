
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QATestingSuite } from '../QATestingSuite';

// Mock environment for development
Object.defineProperty(process.env, 'NODE_ENV', {
  value: 'development',
  writable: true
});

describe('QATestingSuite', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset any localStorage
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('should render in development environment', () => {
      render(<QATestingSuite />);
      
      expect(screen.getByText('🧪 QA Testing Suite')).toBeInTheDocument();
      expect(screen.getByText('Run All Tests')).toBeInTheDocument();
    });

    it('should not render in production without localStorage flag', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
      
      const { container } = render(<QATestingSuite />);
      expect(container.firstChild).toBeNull();
      
      // Reset for other tests
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    });

    it('should render in production with localStorage flag', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production' });
      localStorage.setItem('show-qa-suite', 'true');
      
      render(<QATestingSuite />);
      expect(screen.getByText('🧪 QA Testing Suite')).toBeInTheDocument();
      
      // Reset for other tests
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development' });
    });
  });

  describe('Test Execution', () => {
    it('should run tests when button is clicked', async () => {
      render(<QATestingSuite />);
      
      const runButton = screen.getByText('Run All Tests');
      fireEvent.click(runButton);
      
      // Button should be disabled during execution
      expect(runButton).toBeDisabled();
      expect(screen.getByText('Running Tests...')).toBeInTheDocument();
      
      // Wait for tests to complete
      await waitFor(() => {
        expect(screen.getByText('Run All Tests')).toBeEnabled();
      }, { timeout: 5000 });
    });

    it('should display test results', async () => {
      render(<QATestingSuite />);
      
      const runButton = screen.getByText('Run All Tests');
      fireEvent.click(runButton);
      
      // Wait for tests to complete
      await waitFor(() => {
        expect(screen.getByText('Run All Tests')).toBeEnabled();
      }, { timeout: 5000 });
      
      // Check that test results are displayed
      expect(screen.getByText('Browser Compatibility')).toBeInTheDocument();
      expect(screen.getByText('Accessibility Audit')).toBeInTheDocument();
      expect(screen.getByText('Performance Analysis')).toBeInTheDocument();
      expect(screen.getByText('Image Optimization')).toBeInTheDocument();
    });

    it('should show overall score after tests complete', async () => {
      render(<QATestingSuite />);
      
      const runButton = screen.getByText('Run All Tests');
      fireEvent.click(runButton);
      
      // Wait for tests to complete
      await waitFor(() => {
        expect(screen.getByText('Run All Tests')).toBeEnabled();
      }, { timeout: 5000 });
      
      // Check for overall score display
      expect(screen.getByText('Overall Score')).toBeInTheDocument();
      expect(screen.getByText(/\d+%/)).toBeInTheDocument();
    });
  });

  describe('Global Function', () => {
    it('should expose showQASuite function to window', () => {
      render(<QATestingSuite />);
      
      expect(typeof (window as any).showQASuite).toBe('function');
    });

    it('should set localStorage and reload when showQASuite is called', () => {
      const mockReload = vi.fn();
      Object.defineProperty(window.location, 'reload', {
        value: mockReload,
        writable: true
      });

      render(<QATestingSuite />);
      
      (window as any).showQASuite();
      
      expect(localStorage.getItem('show-qa-suite')).toBe('true');
      expect(mockReload).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<QATestingSuite />);
      
      const runButton = screen.getByRole('button', { name: /run all tests/i });
      expect(runButton).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<QATestingSuite />);
      
      const runButton = screen.getByText('Run All Tests');
      runButton.focus();
      
      expect(document.activeElement).toBe(runButton);
    });
  });
});
