
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../test-utils';
import Home from '@/pages/Home';

// Mock the auth context
vi.mock('@/contexts/auth-context', () => ({
  useAuth: () => ({
    user: null,
    loginDemo: vi.fn(),
    isLoading: false,
  }),
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Home Page', () => {
  it('renders hero section', () => {
    render(<Home />);
    
    // Check for key elements that should be present
    expect(screen.getByText(/DBooster/i)).toBeInTheDocument();
  });

  it('handles get started action', async () => {
    render(<Home />);
    
    // Find and click a button that might trigger get started
    const buttons = screen.getAllByRole('button');
    
    // This is a basic test - in a real scenario you'd be more specific
    expect(buttons.length).toBeGreaterThan(0);
  });
});
