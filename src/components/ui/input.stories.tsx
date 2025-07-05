
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * The Input component provides a styled text input with support for various types,
 * states, and accessibility features.
 * 
 * ## Features:
 * - Multiple input types (text, email, password, search, etc.)
 * - Error states with visual feedback
 * - Disabled states
 * - Full accessibility support
 * - Consistent styling with design system
 * 
 * ## Usage Guidelines:
 * - Always pair with a Label for accessibility
 * - Use appropriate input types for better UX
 * - Provide clear placeholder text when helpful
 * - Show error states with descriptive messages
 */
const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A flexible input component with various states and accessibility features.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
      description: 'HTML input type',
    },
    error: {
      control: 'boolean',
      description: 'Whether the input has an error state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the input is disabled',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input
        id="email"
        type="email"
        placeholder="Enter your email"
      />
    </div>
  ),
};

export const Password: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);
    
    return (
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
};

export const SearchInput: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="search">Search</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="search"
          type="search"
          placeholder="Search..."
          className="pl-10"
        />
      </div>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email-icon">Email</Label>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="email-icon"
          type="email"
          placeholder="Enter your email"
          className="pl-10"
        />
      </div>
    </div>
  ),
};

export const Error: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="error-input">Email</Label>
      <Input
        id="error-input"
        type="email"
        placeholder="Enter your email"
        error={true}
      />
      <p className="text-sm text-destructive">Please enter a valid email address.</p>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const FormExample: Story = {
  render: () => (
    <form className="space-y-4 w-[300px]">
      <div className="space-y-2">
        <Label htmlFor="first-name">First Name</Label>
        <Input id="first-name" placeholder="John" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="last-name">Last Name</Label>
        <Input id="last-name" placeholder="Doe" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="form-email">Email</Label>
        <Input id="form-email" type="email" placeholder="john@example.com" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
      </div>
    </form>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example of inputs used in a form context with proper labels.',
      },
    },
  },
};
