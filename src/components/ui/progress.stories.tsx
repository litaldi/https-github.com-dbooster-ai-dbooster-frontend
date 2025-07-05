
import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './progress';
import { useState, useEffect } from 'react';

/**
 * The Progress component visually represents the completion progress of a task.
 * Built with Radix UI primitives for accessibility and smooth animations.
 * 
 * ## Features:
 * - Smooth animated transitions
 * - Accessible with proper ARIA attributes
 * - Customizable appearance
 * - Supports determinate and indeterminate states
 * 
 * ## Usage Guidelines:
 * - Use for file uploads, form completion, loading states
 * - Always provide a text alternative for screen readers
 * - Consider using indeterminate state for unknown progress
 */
const meta: Meta<typeof Progress> = {
  title: 'UI/Progress',
  component: Progress,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A progress indicator component that shows task completion status.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      control: { type: 'range', min: 0, max: 100, step: 1 },
      description: 'Progress value from 0 to 100',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 60,
  },
  render: (args) => (
    <div className="w-[300px] space-y-2">
      <Progress {...args} />
      <p className="text-sm text-muted-foreground text-center">{args.value}% complete</p>
    </div>
  ),
};

export const Animated: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => setProgress(66), 500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="w-[300px] space-y-2">
        <Progress value={progress} />
        <p className="text-sm text-muted-foreground text-center">{progress}% complete</p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Progress bar with smooth animation on mount.',
      },
    },
  },
};

export const LoadingSimulation: Story = {
  render: () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            return 0; // Reset for demo
          }
          return prev + 1;
        });
      }, 100);

      return () => clearInterval(interval);
    }, []);

    return (
      <div className="w-[300px] space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading file...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
        
        <div className="text-xs text-muted-foreground">
          Simulated upload progress (resets at 100%)
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Simulated file upload progress with percentage display.',
      },
    },
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Small (h-1)</label>
        <Progress value={75} className="h-1" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Default (h-2)</label>
        <Progress value={75} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Large (h-3)</label>
        <Progress value={75} className="h-3" />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Extra Large (h-4)</label>
        <Progress value={75} className="h-4" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different progress bar heights for various use cases.',
      },
    },
  },
};

export const States: Story = {
  render: () => (
    <div className="w-[300px] space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-green-600">Completed</label>
        <Progress value={100} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-blue-600">In Progress</label>
        <Progress value={65} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-orange-600">Starting</label>
        <Progress value={10} />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-600">Not Started</label>
        <Progress value={0} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Progress bars showing different completion states.',
      },
    },
  },
};
